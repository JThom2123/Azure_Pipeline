"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    sponsor: ''
  });

  // Driver's past applications
  const [pastApplications, setPastApplications] = useState([
    { id: 1, sponsor: "Company A", date: "2025-03-06", status: "Pending" },
    { id: 2, sponsor: "Company B", date: "2025-03-02", status: "Accepted" },
    { id: 3, sponsor: "Company C", date: "2025-02-28", status: "Rejected" },
  ]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form submitted', formData);
    router.replace('/driver/home');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const attributes = await fetchUserAttributes();
        const role = attributes?.["custom:role"] || null;
        setUserRole(role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const getHomePage = () => {
    if (userRole === "Administrator") return "/admin/home";
    if (userRole === "Driver") return "/driver/home";
    if (userRole === "Sponsor") return "/sponsor/home";
    return null;
  };

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

        const handleHomeClick = () => {
          const homePage = getHomePage();
          if (homePage) {
            router.push(homePage);
          } else {
            console.error("User role is not set, cannot navigate.");
          }
        };

        const handleProfileClick = () => {
          router.push("/profile");
        };

        return (
          <div className="flex flex-col h-screen">
            {/* Navigation Bar */}
            <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
              <div className="flex space-x-4">
                <button
                  onClick={handleHomeClick}
                  disabled={roleLoading}
                  className={`px-4 py-2 rounded ${roleLoading ? "bg-gray-500 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600"}`}
                >
                  {roleLoading ? "Loading..." : "Home"}
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
                <button className="bg-blue-600 px-4 py-2 rounded hover:bg-gray-600">
                  Application
                </button>
              </div>

              <div className="relative" ref={dropdownRef}>
                <div className="cursor-pointer text-2xl" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <FaUserCircle />
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
                    <button onClick={handleProfileClick} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                      My Profile
                    </button>
                    <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Driver Application Form */}
            <div className="flex flex-col items-center justify-center py-10">
              <h2 className="text-2xl font-bold mb-4">Driver Application</h2>
              <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-md w-3/5 max-w-2xl min-w-[400px]">
                <label htmlFor="first-name">First Name:</label>
                <input type="text" id="first-name" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="border p-2 w-full mb-2" />

                <label htmlFor="last-name">Last Name:</label>
                <input type="text" id="last-name" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="border p-2 w-full mb-2" />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="border p-2 w-full mb-2" />

                <label htmlFor="sponsor">Select a Sponsor:</label>
                <select id="sponsorDropdown" name="sponsor" value={formData.sponsor} onChange={handleInputChange} className="border p-2 w-full mb-2">
                  <option value="">--Please choose a sponsor--</option>
                  <option value="Company A">Company A</option>
                  <option value="Company B">Company B</option>
                  <option value="Company C">Company C</option>
                </select>

                <button type="submit" className="p-2 w-full mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Submit
                </button>
              </form>

              {/* Past Applications Table */}
              <h2 className="text-2xl font-bold mt-10">Past Applications</h2>
              <table className="w-full max-w-2xl border-collapse border border-gray-300 mt-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Sponsor Company</th>
                    <th className="border border-gray-300 px-4 py-2">Date of Application</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pastApplications.map((app) => (
                    <tr key={app.id} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">{app.sponsor}</td>
                      <td className="border border-gray-300 px-4 py-2">{app.date}</td>
                      <td className={`border border-gray-300 px-4 py-2 text-white font-bold ${
                        app.status === "Accepted" ? "bg-green-500" : app.status === "Pending" ? "bg-yellow-500" : "bg-red-500"
                      }`}>
                        {app.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }}
    </Authenticator>
  );
};

export default DriverAppPage;
