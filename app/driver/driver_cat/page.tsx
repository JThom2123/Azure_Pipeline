"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";

export default function ITunesSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  async function handleSearch() {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          searchTerm
        )}&media=music&limit=10`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setResults(
        data.results.map((item: any) => ({
          ...item,
          points: Math.floor(Math.random() * 100) + 1, // Assigning random points for now
        }))
      );
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleSignOut = () => {
    // Implement sign out functionality here (if needed)
    router.replace("/");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
        <div className="flex gap-4">
          <Link href="/driver/home">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
              Home
            </button>
          </Link>
          <Link href="/aboutpage">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
              About Page
            </button>
          </Link>
          <button className="bg-blue-600 px-4 py-2 rounded hover:bg-gray-600">
            Catalog
          </button>
          <button className="bg-blue-600 px-4 py-2 rounded text-white">Catalog</button>
          <Link href="/driver/points">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
              Points
            </button>
          </Link>
          <Link href="/driver/driver_app">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
              Application
            </button>
          </Link>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
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
      <main className="max-w-xl mx-auto p-4 flex-grow">
        <h1 className="text-2xl font-bold mb-4 text-center">Catalog</h1>

        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for songs about TRUCKS..."
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <ul className="mt-4 space-y-4">
          {results.map((item) => (
            <li key={item.trackId || item.collectionId} className="border p-3 rounded shadow flex items-center">
              <img
                src={item.artworkUrl100}
                alt={item.trackName || item.collectionName}
                className="w-24 h-24 rounded mr-4"
              />
              <div className="flex-grow">
                <p className="font-bold">
                  {item.trackName || item.collectionName} - {item.artistName}
                </p>
                <p className="text-sm text-gray-600">Points: {item.points}</p>
              </div>
              {item.previewUrl && (
                <audio controls className="ml-4">
                  <source src={item.previewUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
