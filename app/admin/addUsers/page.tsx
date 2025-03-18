"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Authenticator } from "@aws-amplify/ui-react";
import Link from "next/link";
import { fetchUserAttributes, signOut, signUp } from "aws-amplify/auth";
import { FaUserCircle } from "react-icons/fa";

export default function AdminPage() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [selectedRole, setSelectedRole] = useState("Driver");
    const [sponsorCompany, setSponsorCompany] = useState(""); // New Sponsor Company State
    const [message, setMessage] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    /** Ensure only Admins can access this page */
    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const attributes = await fetchUserAttributes();
                const role = attributes?.["custom:role"] || null;
                setUserRole(role);

                if (role !== "Admin") {
                    alert("Access Denied: You must be an Admin to access this page.");
                    router.replace("/"); // Redirect non-admin users
                }
            } catch (error) {
                console.error("Error fetching user attributes:", error);
                alert("⚠️ Error checking permissions. Redirecting...");
                router.replace("/");
            }
        };

        checkUserRole();
    }, [router]);

    /** Create the user in Cognito */
    const createUserInCognito = async (name: string, email: string, userType: string, sponsorCompany: string) => {
        try {
            console.log("🚀 Creating user in Cognito:", { name, email, userType, sponsorCompany });

            const userAttributes: Record<string, string> = {
                email,
                name,
                "custom:role": userType,
            };

            // Add Sponsor Company to Cognito if the role is "Sponsor"
            if (userType === "Sponsor") {
                userAttributes["custom:sponsorCompany"] = sponsorCompany;
            }

            await signUp({
                username: email,
                password: "Temp123!", // Must be changed later by the user
                options: { userAttributes },
            });

            console.log("User successfully created in Cognito");
            return true;
        } catch (error) {
            console.error("Error creating user in Cognito:", error);
            setMessage("Failed to create user in Cognito. User may already exist.");
            return false;
        }
    };

    /** Add the new user to the database via the API */
    const addUserToDatabase = async (email: string, userType: string, sponsorCompany: string) => {
        try {
            const apiUrl = "https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user";

            console.log("Sending API Request:", { email, userType, sponsorCompany });

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, userType, sponsorCompany }), // Include sponsorCompany
            });

            console.log("API Response Status:", response.status);

            if (response.status === 201) {
                const data = await response.json();
                console.log("User successfully added to database:", data);
                setMessage(`${email} has been added as a ${userType}`);
            } else {
                const errorText = await response.text();
                console.error("API Response Error:", response.status, errorText);
                setMessage(`Failed to add user to database: ${errorText}`);
            }
        } catch (error) {
            console.error("API Request Failed:", error);
            setMessage("Failed to add user to database. Please try again.");
        }
    };

    /** Handle Add User Form Submission */
    const handleAddUser = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!email.trim()) {
            setMessage("Email is required.");
            return;
        }

        if (selectedRole === "Sponsor" && !sponsorCompany.trim()) {
            setMessage("Sponsor company is required for Sponsors.");
            return;
        }

        // Create User in Cognito
        const cognitoSuccess = await createUserInCognito(name, email, selectedRole, sponsorCompany);

        if (cognitoSuccess) {
            // Add User to MySQL Database
            await addUserToDatabase(email, selectedRole, sponsorCompany);
        }
    };

    // Close dropdown when clicking outside
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
                    router.push("/profile"); // Navigate to the profile page
                };
                return (
                    <div className="flex flex-col h-screen">
                        {/* Navigation Bar */}
                        <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
                            <div className="flex space-x-4">
                                <Link href="/">
                                    <button className="bg-gray-700 px-4 py-2 rounded text-white">Home</button>
                                </Link>
                                <Link href="/aboutpage">
                                    <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">About Page</button>
                                </Link>
                                <button className="bg-blue-600 px-4 py-2 rounded hover:bg-gray-600">
                                    Add Users
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

                        {/* Admin Panel Content */}
                        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                            <h1 className="text-3xl font-bold mb-6">Admin - Add Users</h1>

                            {/* Success/Error Message */}
                            {message && <p className="mb-4 text-lg">{message}</p>}

                            {/* User Addition Form */}
                            <form onSubmit={handleAddUser} className="bg-white p-6 rounded shadow-md">
                                <label className="block text-lg font-semibold mb-2">User Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter user name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full p-2 border rounded mb-4"
                                />

                                <label className="block text-lg font-semibold mb-2">User Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter user email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full p-2 border rounded mb-4"
                                />

                                <label className="block text-lg font-semibold mb-2">Select Role</label>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="w-full p-2 border rounded mb-4"
                                >
                                    <option value="Driver">Driver</option>
                                    <option value="Sponsor">Sponsor</option>
                                    <option value="Admin">Admin</option>
                                </select>

                                {/* Sponsor Company Field (Only Visible for Sponsors) */}
                                {selectedRole === "Sponsor" && (
                                    <div>
                                        <label className="block text-lg font-semibold mb-2">Sponsor Company</label>
                                        <input
                                            type="text"
                                            placeholder="Enter sponsor company name"
                                            value={sponsorCompany}
                                            onChange={(e) => setSponsorCompany(e.target.value)}
                                            required
                                            className="w-full p-2 border rounded mb-4"
                                        />
                                    </div>
                                )}

                                <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Add User
                                </button>
                            </form>
                        </div>
                    </div>
                );
            }
            }
        </Authenticator>
    );
}
