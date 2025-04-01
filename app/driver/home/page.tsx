"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { fetchUserAttributes } from "aws-amplify/auth";


export default function HomePage() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sponsorData, setSponsorData] = useState<{ sponsorCompanyName: string; points: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Get user email and fetch sponsor data
  useEffect(() => {
    const getUserEmailAndSponsorData = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const email = attributes.email;
        setUserEmail(email || null);


        const res = await fetch(`https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user/points?email=${email}`);
        if (!res.ok) {
          throw new Error("Failed to fetch sponsor data");
        }

        const data = await res.json();
        if (!data || data.length === 0) {
          setSponsorData(null);
        } else {
          const latest = data[0]; // you only get one row
          setSponsorData({
            sponsorCompanyName: latest.sponsorCompanyName,
            points: latest.points,
          });
        }
      } catch (err) {
        console.error("Error fetching sponsor info:", err);
        setError("Could not load sponsor info.");
      } finally {
        setLoading(false);
      }
    };

    getUserEmailAndSponsorData();
  }, []);


  // Dummy sponsor company data for example
  const sponsors = [
    { name: 'Walmart', points: 120 },
    { name: 'Target', points: 85 },
    { name: 'Amazon', points: 95 },
  ];

  return (
    <Authenticator>
      {({ signOut, user }) => {
        const handleSignOut = () => {
          signOut?.();
          router.replace("/");
        };

        const handleProfileClick = () => {
          router.push("/profile"); // Navigate to the profile page
        };

        return (
          <div className="flex flex-col h-screen">
            {/* Navigation Bar */}
            <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
              <div className="flex gap-4">
                <button className="bg-blue-600 px-4 py-2 rounded text-white">
                  Home
                </button>
                <Link href="/aboutpage">
                  <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                    About Page
                  </button>
                </Link>
                <Link href="/driver/driver_cat">
                  <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                    Catalog
                  </button>
                </Link>
                <Link href="/driver/points">
                  <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                    Points
                  </button>
                </Link>
                <Link href="/driver/driver_app">
                  <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                    Application
                  </button>
                </Link>
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <div
                  className="cursor-pointer text-2xl"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <FaUserCircle />
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
                    <button
                      onClick={handleProfileClick}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center p-10">
              <h1 className="text-5xl font-light mb-4 text-center">
                Welcome, {userEmail || user?.signInDetails?.loginId || "No email found"}
              </h1>
              <p className="text-lg text-center mb-8">
                You are logged in as a driver, a true Mother Trucker! You can view your sponsor(s) below.
                Don't have a sponsor yet? Click the 'Application' tab to fill out your application.
              </p>

              {/* Sponsor Company Information Table */}
              {loading ? (
                <p className="text-center text-lg">Loading sponsor information...</p>
              ) : error ? (
                <p className="text-center text-red-600">{error}</p>
              ) : sponsorData ? (
                <div className="w-full max-w-lg">
                  <h2 className="text-2xl font-semibold text-center mb-4">Sponsor Info</h2>
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Sponsor Company</th>
                        <th className="border border-gray-300 px-4 py-2">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td className="border border-gray-300 px-4 py-2">{sponsorData.sponsorCompanyName}</td>
                        <td className="border border-gray-300 px-4 py-2">{sponsorData.points}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-lg">
                  You are not currently connected to a sponsor company. Please click the “Application” tab above to apply.
                </p>
              )}

            </main>
          </div>
        );
      }}
    </Authenticator>
  );
}
