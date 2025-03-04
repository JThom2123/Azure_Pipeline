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

        return (
          <div className="flex flex-col h-screen">
            {/* Navigation Bar */}
            <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
              <div className="flex gap-4">
                
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
                <Link href="/driver_app">
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

            {/* Main Content */}
            <main className="flex-grow p-10">
              <h1 className="text-5xl font-normal mb-4">
                Welcome, {user?.username || "Username"}
              </h1>
              <div className="w-[627px] p-4 flex justify-between flex-wrap text-lg">
                <span className="w-full sm:w-auto">Account Type: Driver</span>
                <span className="w-full sm:w-auto">Sponsor name: Walmart</span>
                <span className="w-full sm:w-auto">Current Points: 24</span>
              </div>
            </main>
          </div>
        );
      }}
    </Authenticator>
  );
}
