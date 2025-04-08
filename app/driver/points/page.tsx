"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Link from "next/link";
import { fetchUserAttributes } from "aws-amplify/auth";
import { FaUserCircle } from "react-icons/fa";

interface PointHistory {
  sponsorCompanyName: string;
  points: number;
  description: string;
  totalPoints?: number;
}
export default function PointsSponsorPage() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pointHistory, setPointHistory] = useState<PointHistory[]>([]);
  const [userEmail, setUserEmail] = useState("");

  // Read impersonation flag from localStorage on mount:
  useEffect(() => {
    const impersonatedEmail = localStorage.getItem("impersonatedDriverEmail");
    if (impersonatedEmail) {
      setUserEmail(impersonatedEmail);
    } else {
      const getUserEmail = async () => {
        try {
          const attributes = await fetchUserAttributes();
          setUserEmail(attributes.email || "");
        } catch (err) {
          console.error("Error fetching user attributes:", err);
        }
      };
      getUserEmail();
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

  // Fetch point history using userEmail
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userEmail) return;
        const res = await fetch(
          `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user/points/history?email=${userEmail}`
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setPointHistory(data);
        } else {
          console.error("Invalid data received:", data);
        }
      } catch (err) {
        console.error("Error fetching point history:", err);
      }
    };
    fetchData();
  }, [userEmail]);

  // Determine the target route for "Points" based on impersonation
  const impersonatedEmail = localStorage.getItem("impersonatedDriverEmail");
  const pointsPageRoute = impersonatedEmail ? "/driver/points" : "/sponsor/points";

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
              <div className="bg-yellow-200 p-2 text-center mb-4">
                You are currently impersonating{" "}
                <span className="font-bold">{localStorage.getItem("impersonatedDriverEmail")}</span>. Go back to Home Page to stop impersonating.
              </div>
            )}

            {/* Navigation Bar */}
            <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
              <div className="flex gap-4">
                {/* Home button now waits for role to load */}
                <Link href={impersonatedEmail ? "/driver/home" : "/sponsor/home"}>
                  <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                    Home
                  </button>
                </Link>
                <Link href="/aboutpage">
                  <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                    About Page
                  </button>
                </Link>
                <Link href={impersonatedEmail ? "/driver/driver_cat" : "/sponsor/sponsor_cat"}>
                  <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                    Catalog
                  </button>
                </Link>
                <button className="bg-blue-600 px-4 py-2 rounded hover:bg-gray-600">
                  Points
                </button>
                <Link href={impersonatedEmail ? "/driver/driver_app" : "/sponsor/sponsor_app"}>
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
              <p>
                Hello Mother Trucker! Below shows your points and the companies that have given you points or taken points away because they hate you.
              </p>

              {/* Sponsor Company Information Table */}
              <div className="w-full max-w-lg">
                <h2 className="text-2xl font-semibold text-center mb-4">Sponsor(s)</h2>
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Sponsor</th>
                      <th className="border border-gray-300 px-4 py-2">Point Change</th>
                      <th className="border border-gray-300 px-4 py-2">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointHistory.map((item, idx) => (
                      <tr key={idx} className="text-center">
                        <td className="border px-4 py-2">{item.sponsorCompanyName}</td>
                        <td className="border px-4 py-2">{item.points}</td>
                        <td className="border px-4 py-2">{item.description}</td>
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
