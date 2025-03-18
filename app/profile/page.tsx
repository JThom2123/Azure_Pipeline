"use client";

import { useEffect, useState, useRef } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { fetchUserAttributes, updateUserAttributes, resetPassword, confirmResetPassword, confirmUserAttribute, signOut, deleteUser } from "aws-amplify/auth";

export default function ProfilePage() {
    const router = useRouter();
    const [userAttributes, setUserAttributes] = useState({
        name: "",
        email: "",
        phone_number: "",
        address: "",
    });

    const [sponsorCompany, setSponsorCompany] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [passwordResetRequested, setPasswordResetRequested] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [emailChanged, setEmailChanged] = useState(false);
    const [emailVerificationCode, setEmailVerificationCode] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);
    const [roleLoading, setRoleLoading] = useState(true);

    useEffect(() => {
        const getUserAttributes = async () => {
            try {
                const attributes = await fetchUserAttributes();
                if (attributes) {
                    setUserAttributes({
                        name: attributes.name || "",
                        email: attributes.email || "",
                        phone_number: attributes.phone_number || "",
                        address: attributes.address || "",
                    });

                    setUserRole(attributes["custom:role"] || null);

                    if (attributes["custom:sponsorCompany"]) {
                        setSponsorCompany(attributes["custom:sponsorCompany"]);
                    }
                }
            } catch (error) {
                console.error("Error fetching user attributes:", error);
                alert("Session expired. Please log in again.");
                await signOut();
                router.push("/"); // Redirect to login
            } finally {
                setLoading(false);
                setRoleLoading(false);
            }
        };

        getUserAttributes();
    }, []);

    // Update Sponsor Company in Cognito
    const handleSponsorCompanyUpdate = async () => {
        if (!sponsorCompany.trim()) {
            alert("Sponsor company name cannot be empty.");
            return;
        }

        try {
            await updateUserAttributes({ userAttributes: { "custom:sponsorCompany": sponsorCompany } });
            alert("Sponsor company updated successfully!");
        } catch (error) {
            console.error("Error updating sponsor company:", error);
            alert("Failed to update sponsor company. Please try again.");
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

    // Delete Account Function
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone."
        );
    
        if (!confirmDelete) return;
    
        try {
            if (!userAttributes.email) {
                alert("No user email found. Please log in again.");
                return;
            }
    
            const apiUrl = `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user/${userAttributes.email}`;
    
            console.log("Attempting to DELETE user:", apiUrl);
    
            const response = await fetch(apiUrl, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            });
    
            console.log("API Response Status:", response.status);
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error:", errorText);
                alert(`Error deleting account: ${errorText}`);
    
                // If user is not found (404), don't proceed with Cognito deletion
                if (response.status === 404) {
                    alert("User not found in database. No changes made.");
                    return;
                }
    
                return;
            }
    
            const result = await response.json();
            console.log("API Response Body:", result);
            alert("Your account has been deleted successfully from the system.");
    
            // Now delete from AWS Cognito
            await deleteUser();
            alert("Your AWS Cognito account has been deleted.");
    
            await signOut();
            router.replace("/");
    
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Failed to delete the account. Please try again later.");
        }
    };
    

    const handleUpdate = async () => {
        if (!userAttributes) {
            alert("User attributes are not loaded. Please refresh and try again.");
            return;
        }

        try {
            const updatedAttributes: Record<string, string> = {};

            if (userAttributes.email) updatedAttributes["email"] = userAttributes.email;
            if (userAttributes.phone_number) updatedAttributes["phone_number"] = userAttributes.phone_number;
            if (userAttributes.address) updatedAttributes["address"] = userAttributes.address;

            if (Object.keys(updatedAttributes).length === 0) {
                alert("No valid attributes to update.");
                return;
            }

            await updateUserAttributes({ userAttributes: updatedAttributes });

            alert("Profile updated successfully!");

            if (updatedAttributes.email) {
                setEmailChanged(true);
                alert("A verification code has been sent to your new email. Please verify it.");
            }

            const newAttributes = await fetchUserAttributes();
            setUserAttributes({
                name: newAttributes?.name || "",
                email: newAttributes?.email || "",
                phone_number: newAttributes?.phone_number || "",
                address: newAttributes?.address || "",
            });

        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile. Please try again.");
        }
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
        if (userRole === "Admin") return "/admin/home";
        if (userRole === "Driver") return "/driver/home";
        if (userRole === "Sponsor") return "/sponsor/home";
        return null; // No navigation if role isn't determined
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

    // Handle Points Button Click
  const handlePointsClick = () => {
    if (userRole === "Driver") {
      router.push("/driver/points");
    } else if (userRole === "Sponsor") {
      router.push("/sponsor/points");
    } else {
      console.error("User role is not eligible for applications.");
    }
  };

  // Handle Catalog Button Click
  const handleCatalogClick = () => {
    if (userRole === "Driver") {
      router.push("/driver/catalog");
    } else {
      console.error("User role is not eligible for applications.");
    }
  };


    const handleVerifyEmail = async () => {
        try {
            await confirmUserAttribute({
                userAttributeKey: "email",
                confirmationCode: emailVerificationCode,
            });

            alert("Email verified successfully!");
            setEmailChanged(false);
            setEmailVerificationCode("");

            const updatedAttributes = await fetchUserAttributes();
            setUserAttributes((prev) => ({
                ...prev,
                email: updatedAttributes.email || prev.email,
            }));
        } catch (error) {
            console.error("Error verifying email:", error);
            alert("Invalid verification code. Please try again.");
        }
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
    const handlePasswordResetRequest = async () => {
        try {
            await resetPassword({ username: userAttributes.email });
            setPasswordResetRequested(true);
            alert("A verification code has been sent to your email.");
        } catch (error) {
            console.error("Error requesting password reset:", error);
            alert("Error requesting password reset. Please try again.");
        }
    };

    const handlePasswordResetConfirm = async () => {
        if (!newPassword || !confirmNewPassword) {
            alert("Please fill in both password fields.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await confirmResetPassword({
                username: userAttributes.email,
                confirmationCode: resetCode,
                newPassword: newPassword,
            });

            alert("Password successfully reset! You will now be signed out.");

            await signOut(); // Sign out the user completely
            router.push("/"); // Redirect to login page

        } catch (error) {
            console.error("Error confirming password reset:", error);
            alert("Error resetting password. Please check the code and try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-semibold">Loading...</p>
            </div>
        );
    }

    return (
        <Authenticator>
            {({ signOut, user }) => {
                const handleSignOut = () => {
                    signOut?.();
                    router.replace("/");
                };

                return (
                    <div className="flex flex-col h-screen">
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
                                {(userRole === "Driver") && (
                                    <button
                                        onClick={handlePointsClick}
                                        className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                                    >
                                        Points
                                    </button>
                                )}
                                {/* Show Points button for Drivers and Sponsors */}
                                {(userRole === "Driver" || userRole === "Sponsor") && (
                                    <button
                                        onClick={handleCatalogClick}
                                        className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                                    >
                                        Catalog
                                    </button>
                                )}
                                {/* Show Application button for Drivers and Sponsors */}
                                {(userRole === "Driver" || userRole === "Sponsor") && (
                                    <button
                                        onClick={handleApplicationClick}
                                        className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                                    >
                                        Application
                                    </button>
                                )}
                            </div>

                            <div className="relative" ref={dropdownRef}>
                                <div className="cursor-pointer text-2xl" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                    <FaUserCircle />
                                </div>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
                                        <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </nav>

                        <div className="flex flex-col items-center justify-center h-screen p-10">
                            <h1 className="text-4xl font-semibold mb-6">My Profile</h1>
                            <div className="w-full max-w-md space-y-4">
                                <input type="text" className="w-full p-2 border bg-gray-300 rounded cursor-not-allowed" value={userAttributes.name} readOnly placeholder="Name (Cannot be changed)" />

                                <input type="email" className="w-full p-2 border rounded" value={userAttributes.email} onChange={(e) => setUserAttributes({ ...userAttributes, email: e.target.value })} placeholder="Email" />

                                <input type="text" className="w-full p-2 border rounded" value={userAttributes.phone_number} onChange={(e) => setUserAttributes({ ...userAttributes, phone_number: e.target.value })} placeholder="Phone Number" />

                                <input type="text" className="w-full p-2 border rounded" value={userAttributes.address} onChange={(e) => setUserAttributes({ ...userAttributes, address: e.target.value })} placeholder="Address" />

                                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleUpdate}>
                                    Update Profile
                                </button>

                                {emailChanged && (
                                    <div className="space-y-4">
                                        <input type="text" className="w-full p-2 border rounded" value={emailVerificationCode} onChange={(e) => setEmailVerificationCode(e.target.value)} placeholder="Enter verification code" />
                                        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleVerifyEmail}>
                                            Verify Email
                                        </button>
                                    </div>
                                )}

                                {!passwordResetRequested ? (
                                    <button className="bg-yellow-600 text-white px-4 py-2 rounded" onClick={handlePasswordResetRequest}>
                                        Reset Password
                                    </button>
                                ) : (
                                    <div className="space-y-4">
                                        <input type="text" className="w-full p-2 border rounded" value={resetCode} onChange={(e) => setResetCode(e.target.value)} placeholder="Enter code" />
                                        <input type="password" className="w-full p-2 border rounded" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
                                        <input type="password" className="w-full p-2 border rounded" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Confirm new password" />
                                        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handlePasswordResetConfirm}>
                                            Confirm Password Reset
                                        </button>
                                    </div>
                                )}
                                <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleDeleteAccount}>
                                    Delete Account
                                </button>
                                {/* Sponsor Company Section - Visible Only for Sponsors */}
                                {userRole === "Sponsor" && (
                                    <div className="space-y-4 border-t pt-4">
                                        <h2 className="text-lg font-semibold">Sponsor Information</h2>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded"
                                            value={sponsorCompany}
                                            onChange={(e) => setSponsorCompany(e.target.value)}
                                            placeholder="Enter or update sponsor company name"
                                        />
                                        <button
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                            onClick={handleSponsorCompanyUpdate}
                                        >
                                            Update Sponsor Company
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
            }
        </Authenticator>
    );
}
