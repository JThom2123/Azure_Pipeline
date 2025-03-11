"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { fetchUserAttributes } from "aws-amplify/auth";

const ProductInformation: React.FC = () => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Fetch the updated user email on component mount
  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const attributes = await fetchUserAttributes();
        if (attributes.email) {
          setUserEmail(attributes.email);
        }
      } catch (error) {
        console.error("Error fetching user email:", error);
      }
    };

    getUserEmail();
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

  return (
    <Authenticator>
      {({ signOut, user }) => {
        const handleSignOut = () => {
          signOut?.();
          router.replace("/");
        };

        const handleProfileClick = () => {
          router.push("/profile");
        };

        return (
          <div className="flex flex-col h-screen">
            {/* Navigation Bar */}
            <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
              <div className="flex gap-4">
                <Link href="/driver/home">
                  <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Home</button>
                </Link>
                <Link href="/aboutpage">
                  <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">About Page</button>
                </Link>
                <button className="bg-blue-600 px-4 py-2 rounded text-white">Catalog</button>
                <Link href="/driver/points">
                  <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Points</button>
                </Link>
                <Link href="/driver/driver_app">
                  <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Application</button>
                </Link>
                <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">More</button>
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <div className="cursor-pointer text-2xl" onClick={() => setDropdownOpen(!dropdownOpen)}>
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
                Below is the catalog for Walmart.
              </p>

              {/* Product Catalog */}
              <div className="w-full max-w-3xl grid grid-cols-2 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 text-white p-5 rounded shadow-md flex flex-col items-center"
                  >
                    <img src="/Album 1.png" alt="Product" className="w-32 h-32 object-cover mb-4" />
                    <div>Description: Lorem ipsum</div>
                    <div className="mt-2 text-lg font-semibold">Points: 44</div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        );
      }}
    </Authenticator>
  );
};

export default ProductInformation;
