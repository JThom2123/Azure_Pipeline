"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import Link from "next/link";
import { Authenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth"; // Fetch user attributes

interface AboutSection {
  section_name: string;
  content: string;
  last_updated: string;
}

const API_URL =
  "https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/about";


const AboutPage = () => {
  const router = useRouter();
  const [aboutData, setAboutData] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true); // Track role loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: AboutSection[] = await response.json();
        setAboutData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // Fetch User Role on Page Load
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const role = attributes?.["custom:role"] || null;
        setUserRole(role);
        console.log("User Role:", role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setRoleLoading(false); // Stop role loading
      }
    };

    fetchUserRole();
  }, []);

  // Determine Home Page Route Based on Role
  const getHomePage = () => {
    if (userRole === "Administrator") return "/admin/home";
    if (userRole === "Driver") return "/driver/home";
    if (userRole === "Sponsor") return "/sponsor/home";
    return null; // No navigation if role isn't determined
  };

  return (
    <Authenticator>
      {({ signOut, user }) => {
        const handleSignOut = () => {
          signOut?.();
          router.replace("/");
        };

        // Handle Home Button Click (Prevent Navigation if Role is Unknown)
        const handleHomeClick = () => {
          const homePage = getHomePage();
          if (homePage) {
            router.push(homePage);
          } else {
            console.error("User role is not set, cannot navigate.");
          }
        };

        return (
          <div className="flex flex-col h-screen">
            {/* Navigation Bar */}
            <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
              <div className="flex space-x-4">
                {/* Home button now waits for role to load */}
                <button
                  onClick={handleHomeClick}
                  disabled={roleLoading} // Disable until role is loaded
                  className={`px-4 py-2 rounded ${
                    roleLoading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {roleLoading ? "Loading..." : "Home"}
                </button>
                <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                  Catalog
                </button>
                <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                  Points
                </button>
                <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                  More
                </button>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </nav>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <h1 className="text-3xl font-bold mb-4">
                Welcome to Our About Page
              </h1>

              {loading && <p className="text-gray-600">Loading...</p>}
              {error && <p className="text-red-500">Error: {error}</p>}

              {!loading && !error && aboutData.length > 0 ? (
                <div className="space-y-6 max-w-2xl">
                  {aboutData.map((section, index) => (
                    <div key={index} className="border-b pb-4">
                      <h2 className="text-xl font-semibold capitalize">
                        {section.section_name.replace(/_/g, " ")}
                      </h2>
                      <p className="text-gray-700">{section.content}</p>
                      <small className="text-gray-500">
                        Last updated:{" "}
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }).format(new Date(section.last_updated))}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                !loading && <p className="text-gray-600">No data available.</p>
              )}
            </div>
          </div>
        );
      }}
    </Authenticator>
  );
};

export default AboutPage;
