"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Authenticator } from "@aws-amplify/ui-react";
import Link from "next/link";
import { fetchUserAttributes, signOut, signUp } from "aws-amplify/auth";
import { FaUserCircle } from "react-icons/fa";

export default function SponsorAddPage() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [sponsorCompany, setSponsorCompany] = useState<string | null>(null); // Sponsor's company
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    /** Ensure only Sponsors can access this page */
    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const attributes = await fetchUserAttributes();
                const role = attributes?.["custom:role"] || null;
                const company = attributes?.["custom:sponsorCompany"] || null;
                setUserRole(role);
                setSponsorCompany(company);

                if (role !== "Sponsor") {
                    alert("Access Denied: You must be a Sponsor to access this page.");
                    router.replace("/"); // Redirect non-sponsors
                }
            } catch (error) {
                console.error("Error fetching user attributes:", error);
                alert("⚠️ Error checking permissions. Redirecting...");
                router.replace("/");
            }
        };

        checkUserRole();
    }, [router]);

    /** Create the new Sponsor user in Cognito */
    const createUserInCognito = async (name: string, email: string, sponsorCompany: string) => {
        try {
            console.log("Creating Sponsor in Cognito:", { name, email, sponsorCompany });

            await signUp({
                username: email,
                password: "TempPassword123!", // Must be changed later by the user
                options: {
                    userAttributes: {
                        email,
                        name,
                        "custom:role": "Sponsor",
                        "custom:sponsorCompany": sponsorCompany, // Assign the same sponsor company
                    },
                },
            });

            console.log("Sponsor successfully created in Cognito");
            return true;
        } catch (error) {
            console.error("Error creating Sponsor in Cognito:", error);
            setMessage("Failed to create Sponsor in Cognito. User may already exist.");
            return false;
        }
    };

    /** Step 2: Add the new Sponsor to the database via the API */
    const addUserToDatabase = async (email: string, sponsorCompany: string) => {
        try {
            const apiUrl = "https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user";

            console.log("Sending API Request:", { email, sponsorCompany });

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, userType: "Sponsor", sponsorCompany }), // Include sponsorCompany
            });

            console.log("API Response Status:", response.status);

            if (response.status === 201) {
                const data = await response.json();
                console.log("Sponsor successfully added to database:", data);
                setMessage(`${email} has been added as a Sponsor under ${sponsorCompany}`);
            } else {
                const errorText = await response.text();
                console.error("API Response Error:", response.status, errorText);
                setMessage(`Failed to add Sponsor to database: ${errorText}`);
            }
        } catch (error) {
            console.error("API Request Failed:", error);
            setMessage("Failed to add Sponsor to database. Please try again.");
        }
    };

    /** Handle Add Sponsor Form Submission */
    const handleAddSponsor = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!email.trim()) {
            setMessage("⚠️ Email is required.");
            return;
        }

        if (!sponsorCompany) {
            setMessage("⚠️ You must have a sponsor company to add other sponsors.");
            return;
        }

        // Create Sponsor in Cognito
        const cognitoSuccess = await createUserInCognito(name, email, sponsorCompany);

        if (cognitoSuccess) {
            // Add Sponsor to MySQL Database
            await addUserToDatabase(email, sponsorCompany);
        }
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
                        {/* Navigation Bar */}
                        <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
                            <div className="flex space-x-4">
                                <Link href="/">
                                    <button className="bg-gray-700 px-4 py-2 rounded text-white">
                                        Home</button>
                                </Link>
                                <Link href="/aboutpage">
                                    <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                                        About Page</button>
                                </Link>

                                <Link href="/sponsor/sponsor_cat">
                                    <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                                        Catalog</button>
                                </Link>
                                <Link href="/sponsor/points">
                                    <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                                        Points</button>
                                </Link>
                                <Link href="/sponsor/sponsor_app">
                                    <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                                        Application</button>
                                </Link>
                                <button className="bg-blue-600 px-4 py-2 rounded hover:bg-gray-600">
                                    Add Sponsors</button>
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

                        {/* Sponsor Add Panel */}
                        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                            <h1 className="text-3xl font-bold mb-6">Sponsor - Add Other Sponsors</h1>

                            {/* Success/Error Message */}
                            {message && <p className="mb-4 text-lg">{message}</p>}

                            {/* Sponsor Addition Form */}
                            <form onSubmit={handleAddSponsor} className="bg-white p-6 rounded shadow-md">
                                <label className="block text-lg font-semibold mb-2">Sponsor Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter sponsor's full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full p-2 border rounded mb-4"
                                />

                                <label className="block text-lg font-semibold mb-2">Sponsor Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter sponsor's email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full p-2 border rounded mb-4"
                                />

                                <label className="block text-lg font-semibold mb-2">Sponsor Company</label>
                                <input
                                    type="text"
                                    value={sponsorCompany || ""}
                                    readOnly // Auto-filled, read-only
                                    className="w-full p-2 border bg-gray-300 rounded mb-4 cursor-not-allowed"
                                />

                                <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Add Sponsor
                                </button>
                            </form>
                        </div>
                    </div>
                );
            }}
        </Authenticator>
    );

}

