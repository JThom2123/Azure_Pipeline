"use client";  // Ensure this is at the top of the file for client-side behavior

import { useState, useEffect, useRef } from "react";  // Import useState here
import { useRouter } from "next/navigation";  // Correct import for useRouter in App Router
import Link from "next/link";
import { Authenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";
import { FaUserCircle } from "react-icons/fa"; 

const DriverAppPage = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Assuming you have a way to get the user role or you want to submit form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    sponsor: ''
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission
    console.log('Form submitted', formData); // Log form data for debugging

    // After form submission, redirect to /driver/home (or any other page)
    router.replace('/driver/home');
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

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

  // Handle Application Button Click
  const handleApplicationClick = () => {
    if (userRole === "Driver") {
      router.push("/driver/driver_app");
    } else if (userRole === "Sponsor") {
      router.push("/sponsor/sponsor_app");
    } else {
      console.error("User role is not eligible for applications.");
    }
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
                <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                  Points
                </button>
                <button className="bg-blue-600 px-4 py-2 rounded hover:bg-gray-600">
                    Application
                  </button>
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

            <div style={{ fontFamily: "'Times New Roman', Times, serif", display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'white', margin: 0 }}>
              <form onSubmit={handleSubmit} style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', width: '60%', maxWidth: '800px', minWidth: '400px' }}>
                <h2 style={{ textAlign: 'center' }}>Driver Application</h2>

                <label htmlFor="first-name">First Name:</label>
                <input
                  type="text"
                  id="first-name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px', border: '2px solid #ccc', borderRadius: '4px' }} // Border added
                />

                <label htmlFor="last-name">Last Name:</label>
                <input
                  type="text"
                  id="last-name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px', border: '2px solid #ccc', borderRadius: '4px' }} // Border added
                />

                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px', border: '2px solid #ccc', borderRadius: '4px' }} // Border added
                />

                <label htmlFor="phone">Phone Number:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px', border: '2px solid #ccc', borderRadius: '4px' }} // Border added
                />

                <label htmlFor="sponsor">Select a Sponsor:</label>
                <select
                  id="sponsorDropdown"
                  name="sponsor"
                  value={formData.sponsor}
                  onChange={handleInputChange}
                  style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px', border: '2px solid #ccc', borderRadius: '4px' }} // Border added
                >
                  <option value="">--Please choose a sponsor--</option>
                  <option value="Option 1">Option 1</option>
                  <option value="Option 2">Option 2</option>
                  <option value="Option 3">Option 3</option>
                </select>

                <button
                  type="submit"
                  style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: '2px solid #007bff', borderRadius: '4px', cursor: 'pointer', display: 'block', width: '100%', marginBottom: '10px' }} // Border added
                >
                  Submit
                </button>
              </form>
            </div>
          </div>

        );
      }}
    </Authenticator>
  );
};

export default DriverAppPage;
