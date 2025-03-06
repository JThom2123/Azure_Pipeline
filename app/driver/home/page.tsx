"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

type SponsorStatusProps = {
  sponsor: string;
  points: number;
  status: 'pending' | 'approved' | 'declined';
  onClick: (sponsor: string, points: number) => void; // Updated to remove status from the event handler
};

function SponsorStatus({
  sponsor,
  points,
  status,
  onClick
}: SponsorStatusProps) {
  let statusColor = '';
  let statusText = '';

  // Set the button color and text based on status with lighter shades
  switch (status) {
    case 'pending':
      statusColor = 'bg-orange-200 hover:bg-orange-300';
      statusText = 'Pending';
      break;
    case 'approved':
      statusColor = 'bg-green-200 hover:bg-green-300';
      statusText = 'Approved';
      break;
    case 'declined':
      statusColor = 'bg-red-200 hover:bg-red-300';
      statusText = 'Declined';
      break;
  }

  return (
    <div className="w-full sm:w-[200px] md:w-[300px] lg:w-[400px] p-4 mb-4">
      <button 
        className={`${statusColor} w-full h-[150px] p-4 flex flex-col justify-center items-center text-black text-xl font-semibold rounded`}
        onClick={() => onClick(sponsor, points)} // Update header with sponsor and points only
      >
        <div className="text-center">
          <p>Sponsor: {sponsor}</p>
          <p>Points: {points}</p>
          <p>Status: {statusText}</p>
        </div>
      </button>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // State to manage header information, initially set to approved sponsor (Target)
  const [headerInfo, setHeaderInfo] = useState<{
    sponsor: string;
    points: number;
  }>({
    sponsor: "Target", // Default to approved sponsor
    points: 50, // Default points for approved sponsor
  });

  // Update header info based on selected sponsor
  const handleSponsorClick = (sponsor: string, points: number) => {
    setHeaderInfo({ sponsor, points });
  };

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
                <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                  Catalog
                </button>
                <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                  Points
                </button>
                <Link href="/driver/driver_app">
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
              {/* Welcome message */}
              <h1 className="text-5xl font-normal mb-4">
                Welcome, {user?.signInDetails?.loginId || "No email found"}
              </h1>

              {/* Sponsor info displayed below the welcome message */}
              <div className="w-[627px] p-4 flex justify-between flex-wrap text-lg mb-4">
                <span className="w-full sm:w-auto">Account Type: Driver</span>
                <span className="w-full sm:w-auto">Sponsor Name: {headerInfo.sponsor}</span>
                <span className="w-full sm:w-auto">Current Points: {headerInfo.points}</span>
              </div>

              {/* Example Sponsor Status - Stacked Buttons */}
              <div className="flex flex-col gap-4 justify-center items-center mt-6">
                <SponsorStatus sponsor="Walmart" points={24} status="pending" onClick={handleSponsorClick} />
                <SponsorStatus sponsor="Target" points={50} status="approved" onClick={handleSponsorClick} />
                <SponsorStatus sponsor="Amazon" points={12} status="declined" onClick={handleSponsorClick} />
              </div>
            </main>
          </div>
        );
      }}
    </Authenticator>
  );
}
