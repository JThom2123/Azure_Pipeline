"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

export default function PointsSponsorPage() {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    // Dummy data for table
    const [drivers, setDrivers] = useState([
      { name: 'John Doe', currPoints: 120, pointChange: 0, reason: '', newTotal: 120 },
      { name: 'Jane Smith', currPoints: 85, pointChange: 0, reason: '', newTotal: 85 },
      { name: 'Bob Johnson', currPoints: 95, pointChange: 0, reason: '', newTotal: 95 },
  ]);

    return (
        <Authenticator>
            {({ signOut, user }) => {
                const handleSignOut = () => {
                    signOut?.();
                    router.replace("/");
                };

                // Handle point change and reason update
                const handlePointChange = (index: number, newPoints: number, reason: string) => {
                    if (!reason.trim()) {
                        alert("Please provide a reason for the point change.");
                        return;
                    }

                    setDrivers(prevDrivers => {
                        const updatedDrivers = [...prevDrivers];
                        updatedDrivers[index].pointChange = newPoints;
                        updatedDrivers[index].reason = reason;
                        updatedDrivers[index].newTotal = updatedDrivers[index].currPoints + newPoints;
                        return updatedDrivers;
                    });
                };

                const handleProfileClick = () => {
                    router.push("/profile");
                };

                return (
                    <div className="flex flex-col h-screen">
                        {/* Navigation Bar */}
                        <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
                            <div className="flex gap-4">
                                <Link href="/sponsor/home">
                                    <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                                        Home
                                    </button>
                                </Link>
                                <Link href="/aboutpage">
                                    <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                                        About Page
                                    </button>
                                </Link>
                                <Link href="/sponsor/sponsor_cat">
                                    <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                                        Catalog
                                    </button>
                                </Link>
                                <button className="bg-blue-600 px-4 py-2 rounded hover:bg-gray-600">
                                    Points
                                </button>
                                <Link href="/sponsor/sponsor_app">
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
                                Welcome, {user?.signInDetails?.loginId || "No email found"}
                            </h1>
                            <p>Hello Mother Trucker! Below shows your drivers and their points!</p>

                            {/* Sponsor Company Information Table */}
                            <div className="w-full max-w-4xl">
                                <h2 className="text-2xl font-semibold text-center mb-4">Drivers</h2>
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border border-gray-300 px-4 py-2">Driver Name</th>
                                            <th className="border border-gray-300 px-4 py-2">Current Points</th>
                                            <th className="border border-gray-300 px-4 py-2">Point Change (+/-)</th>
                                            <th className="border border-gray-300 px-4 py-2">Reason for Change</th>
                                            <th className="border border-gray-300 px-4 py-2">New Total Points</th>
                                            <th className="border border-gray-300 px-4 py-2">Update</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {drivers.map((driver, index) => (
                                            <tr key={index} className="text-center">
                                                <td className="border border-gray-300 px-4 py-2">{driver.name}</td>
                                                <td className="border border-gray-300 px-4 py-2">{driver.currPoints}</td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <input
                                                        type="number"
                                                        className="w-16 p-1 border border-gray-400 rounded"
                                                        value={driver.pointChange}
                                                        onChange={(e) =>
                                                            setDrivers(prevDrivers => {
                                                                const updatedDrivers = [...prevDrivers];
                                                                updatedDrivers[index].pointChange = Number(e.target.value);
                                                                return updatedDrivers;
                                                            })
                                                        }
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <input
                                                        type="text"
                                                        className="w-full p-1 border border-gray-400 rounded"
                                                        value={driver.reason}
                                                        onChange={(e) =>
                                                            setDrivers(prevDrivers => {
                                                                const updatedDrivers = [...prevDrivers];
                                                                updatedDrivers[index].reason = e.target.value;
                                                                return updatedDrivers;
                                                            })
                                                        }
                                                    />
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">{driver.newTotal}</td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <button
                                                        onClick={() =>
                                                            handlePointChange(index, driver.pointChange, driver.reason)
                                                        }
                                                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                                                    >
                                                        Apply
                                                    </button>
                                                </td>
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
