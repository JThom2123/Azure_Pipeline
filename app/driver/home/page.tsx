"use client";

import { useRouter } from "next/navigation";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Link from "next/link";

type SponsorStatusProps = {
  sponsor: string;
  points: number;
  status: 'pending' | 'approved' | 'declined';
};

function SponsorStatus({
  sponsor,
  points,
  status,
}: SponsorStatusProps) {
  let statusColor = '';
  let statusText = '';

  // Set the button color and text based on status with lighter shades
  switch (status) {
    case 'pending':
      statusColor = 'bg-orange-200 hover:bg-orange-300';
      statusText = 'Pending';
      break;
    case 'approved':
      statusColor = 'bg-green-200 hover:bg-green-300';
      statusText = 'Approved';
      break;
    case 'declined':
      statusColor = 'bg-red-200 hover:bg-red-300';
      statusText = 'Declined';
      break;
  }

  return (
    <div className="w-full sm:w-[200px] md:w-[300px] lg:w-[400px] p-4 mb-4">
      <button className={`${statusColor} w-full h-[150px] p-4 flex flex-col justify-center items-center text-black text-xl font-semibold rounded`}>
        <div className="text-center">
          <p>Sponsor: {sponsor}</p>
          <p>Points: {points}</p>
          <p>Status: {statusText}</p>
        </div>
      </button>
    </div>
  );
}

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
              <div className="w-[627px] p-4 flex justify-between flex-wrap text-lg mb-4">
                <span className="w-full sm:w-auto">Account Type: Driver</span>
                <span className="w-full sm:w-auto">Sponsor name: Walmart</span>
                <span className="w-full sm:w-auto">Current Points: 24</span>
              </div>

              {/* Example Sponsor Status - Stacked Buttons */}
              <div className="flex flex-col gap-4 justify-center items-center mt-6">
                <SponsorStatus sponsor="Walmart" points={24} status="pending" />
                <SponsorStatus sponsor="Target" points={50} status="approved" />
                <SponsorStatus sponsor="Amazon" points={12} status="declined" />
              </div>
            </main>
          </div>
        );
      }}
    </Authenticator>
  );
}
