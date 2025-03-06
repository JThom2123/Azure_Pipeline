"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Authenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";
import { FaUserCircle } from "react-icons/fa";

const SponsorApplication = () => {
    const [drivers, setDrivers] = useState([{ id: 1 }]);
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [roleLoading, setRoleLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const addDriver = () => {
        setDrivers([...drivers, { id: drivers.length + 1 }]);
    };

    const removeDriver = () => {
        if (drivers.length > 1) {
            setDrivers(drivers.slice(0, -1));
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        alert("Application submitted successfully! Redirecting to sponsor page...");
        router.push("/sponsor/home");
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

                        {/*Application Form*/}
                        <div className="flex justify-center items-center h-screen bg-white">
                            <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-md w-3/5 max-w-2xl min-w-[400px]">
                                <h2 className="text-center text-xl font-bold">Sponsor Application</h2>
                                <label htmlFor="sponsor-name">Sponsor Name:</label>
                                <input type="text" id="sponsor-name" name="sponsor-name" required className="border p-2 w-full mb-2" />

                                <h3 className="text-left text-lg font-semibold">Driver Information</h3>
                                <div id="driversContainer">
                                    {drivers.map((driver) => (
                                        <div key={driver.id} className="driver mb-4">
                                            <label>Driver First Name:</label>
                                            <input type="text" name="Driver-first-name" required className="border p-2 w-full mb-2" />
                                            <label>Driver Last Name:</label>
                                            <input type="text" name="Driver-last-name" required className="border p-2 w-full mb-2" />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2 justify-center mt-4">
                                    <button type="button" onClick={addDriver} className="p-2 w-48 bg-yellow-400 text-black rounded-md hover:bg-yellow-500">
                                        ➕ Add Another Driver
                                    </button>
                                    <button type="button" onClick={removeDriver} className="p-2 w-48 bg-red-400 text-white rounded-md hover:bg-red-500">
                                        ❌ Remove Last Driver
                                    </button>
                                </div>

                                <button type="submit" className="p-2 w-full mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
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

export default SponsorApplication;
