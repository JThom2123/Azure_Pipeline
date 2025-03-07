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
                <div className="flex gap-4">
                  {/* Home button now waits for role to load */}
                  <button
                                    onClick={handleHomeClick}
                                    disabled={roleLoading} // Disable until role is loaded
                                    className={`px-4 py-2 rounded ${roleLoading
                                        ? "bg-gray-500 cursor-not-allowed"
                                        : "bg-gray-700 hover:bg-gray-600"
                                        }`}
                                >
                                    {roleLoading ? "Loading..." : "Home"}
                                </button>
                  <Link href="/aboutpage">
                    <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                      About Page
                    </button>
                  </Link>
                  <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                    Catalog
                  </button>
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
              <main className="flex-grow p-10">
                <h1 className="text-5xl font-light mb-4">
                  Welcome, {user?.signInDetails?.loginId || "No email found"}
                </h1>
                <p>
                  Sponsor Points Page
                </p>
              </main>
            </div>
          );
        }}
      </Authenticator>
    );
  }
  