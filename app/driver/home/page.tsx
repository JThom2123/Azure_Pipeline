"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { fetchUserAttributes } from "aws-amplify/auth";
import React from "react";

export default function HomePage() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sponsorData, setSponsorData] = useState<
    { sponsorCompanyName: string; totalPoints: number }[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // When the page mounts, check if impersonation is active via localStorage.
  useEffect(() => {
    const impersonatedEmail = localStorage.getItem("impersonatedDriverEmail");
    if (impersonatedEmail) {
      setUserEmail(impersonatedEmail);
    } else {
      // Otherwise get email from Cognito.
      const getUserAttributes = async () => {
        try {
          const attributes = await fetchUserAttributes();
          const email = attributes.email;
          setUserEmail(email || null);
        } catch (err) {
          console.error("Error fetching user attributes:", err);
        }
      };
      getUserAttributes();
    }
  }, []);

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
  /*useEffect(() => {
    const getUserEmailAndSponsorData = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const email = attributes.email;
        setUserEmail(email || null);

        const res = await fetch(`https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user/points?email=${email}`);
        if (!res.ok) {
          throw new Error("Failed to fetch sponsor data");
        }

        const data: any[] = await res.json();
        console.log("Data returned from API:", data);

        if (!data || data.length === 0) {
          setSponsorData(null);
        } else {
          // Group the records by sponsorCompanyName and sum the points
          const groupedData = data.reduce<Record<string, number>>((acc, record) => {
            const sponsorName = record.sponsorCompanyName;
            const points = Number(record.totalPoints ?? record.points);
            if (acc[sponsorName] !== undefined) {
              acc[sponsorName] += points;
            } else {
              acc[sponsorName] = points;
            }
            return acc;
          }, {});

          // Convert the grouped data into an array of sponsor objects
          const sponsorArray = Object.entries(groupedData).map(([sponsorCompanyName, points]) => ({
            sponsorCompanyName,
            totalPoints: points,
          }));

          setSponsorData(sponsorArray);
        }
      } catch (err) {
        console.error("Error fetching sponsor info:", err);
        setError("Could not load sponsor info.");
      } finally {
        setLoading(false);
      }
    };

    getUserEmailAndSponsorData();
  }, []);*/

  // Fetch sponsor data using userEmail (which might be impersonated)
  useEffect(() => {
    const getSponsorData = async () => {
      try {
        if (!userEmail) {
          return;
        }
        const res = await fetch(
          `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user/points?email=${userEmail}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch sponsor data");
        }
        const data: any[] = await res.json();
        console.log("Data returned from API:", data);
        if (!data || data.length === 0) {
          setSponsorData(null);
        } else {
          const groupedData = data.reduce<Record<string, number>>((acc, record) => {
            const sponsorName = record.sponsorCompanyName;
            const points = Number(record.totalPoints ?? record.points);
            if (acc[sponsorName] !== undefined) {
              acc[sponsorName] += points;
            } else {
              acc[sponsorName] = points;
            }
            return acc;
          }, {});
          const sponsorArray = Object.entries(groupedData).map(([sponsorCompanyName, points]) => ({
            sponsorCompanyName,
            totalPoints: points,
          }));
          setSponsorData(sponsorArray);
        }
      } catch (err) {
        console.error("Error fetching sponsor info:", err);
        setError("Could not load sponsor info.");
      } finally {
        setLoading(false);
      }
    };

    getSponsorData();
  }, [userEmail]);

  useEffect(() => {
    const impersonatedEmail = localStorage.getItem("impersonatedDriverEmail");
    if (impersonatedEmail) {
      setUserEmail(impersonatedEmail);
    } else {
      // Otherwise, fetch the email from Cognito using fetchUserAttributes.
      const getUserEmail = async () => {
        try {
          const attributes = await fetchUserAttributes();
          setUserEmail(attributes.email || null);
        } catch (err) {
          console.error("Error fetching user attributes:", err);
        }
      };
      getUserEmail();
    }
  }, []);

  // Handler for "Stop Impersonation" button: clear localStorage and reload page.
  const handleStopImpersonation = () => {
    localStorage.removeItem("impersonatedDriverEmail");
    router.replace("/sponsor/home");
  };

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
            {/* Impersonation Banner */}
            {localStorage.getItem("impersonatedDriverEmail") && (
              <div className="bg-yellow-200 p-4 text-center">
                <p className="text-lg font-semibold">
                  You are impersonating{" "}
                  <span className="underline">{localStorage.getItem("impersonatedDriverEmail")}</span>.
                </p>
                <button onClick={handleStopImpersonation} className="mt-2 bg-red-500 text-white px-4 py-1 rounded">
                  Stop Impersonation
                </button>
              </div>
            )}

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
              ) : sponsorData && sponsorData.length > 0 ? (
                <div className="w-full max-w-lg">
                  <h2 className="text-2xl font-semibold text-center mb-4">Sponsor Info</h2>
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Sponsor Company</th>
                        <th className="border border-gray-300 px-4 py-2">Total Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sponsorData.map((sponsor, idx) => (
                        <tr key={idx} className="text-center">
                          <td className="border border-gray-300 px-4 py-2">{sponsor.sponsorCompanyName}</td>
                          <td className="border border-gray-300 px-4 py-2">{sponsor.totalPoints}</td>
                        </tr>
                      ))}
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
