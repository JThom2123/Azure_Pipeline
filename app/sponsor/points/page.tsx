"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Link from "next/link";
import { fetchUserAttributes } from "aws-amplify/auth";
import { FaUserCircle } from "react-icons/fa";

export default function PointsSponsorPage() {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [roleLoading, setRoleLoading] = useState(true);
  
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

    return (
      <Authenticator>
        {({ signOut, user }) => {
          const handleSignOut = () => {
            signOut?.();
            router.replace("/");
          };

          // Dummy table info  for example
        const tableInfo = [
          { sponsor: 'Walmart', currPoints: 120, pointChange: +10, reason: 'Good Driving!', newTotal: 130 },
          { sponsor: 'Target', currPoints: 85, pointChange: -5, reason: 'Ran over squirrel :(', newTotal: 70 },
          { sponsor: 'Amazon', currPoints: 95, pointChange: -20, reason: 'Hit traffic light :(', newTotal: 75},
        ];

        const handleProfileClick = () => {
          router.push("/profile"); // Navigate to the profile page
        };

          return (
            <div className="flex flex-col h-screen">
              {/* Navigation Bar */}
              <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
                <div className="flex gap-4">
                  {/* Home button now waits for role to load */}
                  <Link href="/sponsor/home">
                    <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                      Home
                    </button>
                  </Link>
                  <Link href="/aboutpage">
                    <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                      About Page
                    </button>
                  </Link>
                  <Link href="/sponsor/sponsor_cat">
                    <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                      Catalog
                    </button>
                  </Link>
                  <button className="bg-blue-600 px-4 py-2 rounded hover:bg-gray-600">
                    Points
                  </button>
                  <Link href="/sponsor/sponsor_app">
                    <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                      Application
                    </button>
                  </Link>
                  <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                    More
                  </button>
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
                  Welcome, {user?.signInDetails?.loginId || "No email found"}
                </h1>
                <p>
                  Hello Mother Trucker! Below shows your drivers and their points!
                </p>

                {/* Sponsor Company Information Table */}
              <div className="w-full max-w-lg">
                <h2 className="text-2xl font-semibold text-center mb-4">Sponsor(s)</h2>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2">Driver Name</th>
                      <th className="border border-gray-300 px-4 py-2">Current Points</th>
                      <th className="border border-gray-300 px-4 py-2">Point Change (+/-)</th>
                      <th className="border border-gray-300 px-4 py-2">Reason for Point Change</th>
                      <th className="border border-gray-300 px-4 py-2">New Total Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableInfo.map((tableInfo, index) => (
                      <tr key={index} className="text-center">
                        <td className="border border-gray-300 px-4 py-2">{tableInfo.sponsor}</td>
                        <td className="border border-gray-300 px-4 py-2">{tableInfo.currPoints}</td>
                        <td className="border border-gray-300 px-4 py-2">{tableInfo.pointChange}</td>
                        <td className="border border-gray-300 px-4 py-2">{tableInfo.reason}</td>
                        <td className="border border-gray-300 px-4 py-2">{tableInfo.newTotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </main>
            </div>
          );
        }}
      </Authenticator>
    );
  }
  