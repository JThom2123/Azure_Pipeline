"use client";

import { useRouter } from "next/navigation";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();

  return (
    <Authenticator>
      {({ signOut, user }) => {
        const handleSignOut = () => {
          signOut?.();
          router.replace("/");
        };

        // Dummy driver data for example
        const drivers = [
          { name: 'John Doe', points: 120 },
          { name: 'Jane Smith', points: 85 },
          { name: 'Mark Johnson', points: 95 },
        ];

        return (
          <div className="flex flex-col h-screen">
            {/* Navigation Bar */}
            <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
              <div className="flex gap-4">
                <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
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
                <Link href="/sponsor/sponsor_app">
                  <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                    Application
                  </button>
                </Link>
                <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
                  More
                </button>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Sign Out
              </button>
            </nav>

            {/* Main Layout */}
            <div className="flex flex-1">
              {/* Sidebar */}
              <aside className="w-64 bg-gray-200 p-5 border-r-2 border-gray-300">
                {/* Add sidebar info as needed */}
              </aside>

              {/* Main Content */}
              <main className="flex-grow p-10">
                <h1 className="text-5xl font-light mb-4">
                  Welcome, {user?.signInDetails?.loginId || "No email found"}
                </h1>
                <p>
                  You are the best programmer in the world! Keep up the great
                  work!! & you are a sponsor
                </p>

                {/* Driver Information Section */}
                <div className="mt-6">
                  <div className="space-y-4">
                    {drivers.map((driver, index) => (
                      <div key={index} className="flex justify-start gap-4">
                        <button className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400">
                          {driver.name} - {driver.points} Points
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </main>
            </div>
          </div>
        );
      }}
    </Authenticator>
  );
}
