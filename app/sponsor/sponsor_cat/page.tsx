"use client"; // <-- This marks the file as a client-side component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";

export default function ITunesSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState<any[]>([]); // Track selected songs for the catalog
  const [showCatalog, setShowCatalog] = useState(false); // State to control visibility of selected songs

  const router = useRouter();

  // Load points and selected songs from localStorage on component mount
  useEffect(() => {
    const storedPoints = localStorage.getItem("songPoints");
    if (storedPoints) {
      const parsedPoints = JSON.parse(storedPoints);
      setResults(parsedPoints);
    }

    const storedSelectedSongs = localStorage.getItem("selectedSongs");
    if (storedSelectedSongs) {
      setSelectedSongs(JSON.parse(storedSelectedSongs));
    }
  }, []);

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

      const newResults = data.results.map((item: any) => {
        const storedPoints = getStoredPoints(item.trackId);
        return {
          ...item,
          points: storedPoints !== null ? storedPoints : Math.floor(Math.random() * 100) + 1,
        };
      });

      localStorage.setItem("songPoints", JSON.stringify(newResults));
      setResults(newResults);
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
    router.replace("/");
  };

  const getStoredPoints = (trackId: number) => {
    const storedPoints = localStorage.getItem("songPoints");
    if (storedPoints) {
      const parsedPoints = JSON.parse(storedPoints);
      const song = parsedPoints.find((item: any) => item.trackId === trackId);
      return song ? song.points : null;
    }
    return null;
  };

  const handleEditPoints = (trackId: number, newPoints: number) => {
    const updatedResults = results.map((item) =>
      item.trackId === trackId ? { ...item, points: newPoints } : item
    );
    setResults(updatedResults);
    localStorage.setItem("songPoints", JSON.stringify(updatedResults));
  };

  const toggleSelectSong = (song: any) => {
    const isSelected = selectedSongs.some((selectedSong) => selectedSong.trackId === song.trackId);
    const updatedSelectedSongs = isSelected
      ? selectedSongs.filter((selectedSong) => selectedSong.trackId !== song.trackId)
      : [...selectedSongs, song];

    setSelectedSongs(updatedSelectedSongs);
    localStorage.setItem("selectedSongs", JSON.stringify(updatedSelectedSongs));
  };

  return (
    <div className="flex flex-col h-screen">
      <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
        <div className="flex gap-4">
          <Link href="/sponsor/home">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Home</button>
          </Link>
          <Link href="/aboutpage">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">About Page</button>
          </Link>
          <button className="bg-blue-600 px-4 py-2 rounded text-white">Catalog</button>
          <Link href="/sponsor/points">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Points</button>
          </Link>
          <Link href="/sponsor/sponsor_app">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Application</button>
          </Link>
          <Link href="/sponsor/addSponsors">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Add Sponsors</button>
          </Link>
        </div>

        <div className="relative">
          <div
            className="cursor-pointer text-2xl"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUserCircle />
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
              <button onClick={handleProfileClick} className="block w-full text-left px-4 py-2 hover:bg-gray-200">My Profile</button>
              <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Sign Out</button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-3xl mx-auto p-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-center">Catalog</h1>

        {/* Conditional rendering based on whether the catalog is shown */}
        {!showCatalog && (
          <div className="flex gap-2 mb-6">
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

            <button
              onClick={() => setShowCatalog(true)}
              className="bg-green-500 text-white px-4 py-2 rounded ml-4"
            >
              View My Catalog
            </button>
          </div>
        )}

        {showCatalog && (
          <div className="mb-6">
            <button
              onClick={() => setShowCatalog(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Back to Search
            </button>
          </div>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {/* Show the list of selected songs if showCatalog is true */}
        {showCatalog && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Your Selected Songs:</h2>
            {selectedSongs.length === 0 ? (
              <p className="text-gray-500">You haven't selected any songs yet.</p>
            ) : (
              <ul className="space-y-4">
                {selectedSongs.map((song) => (
                  <li key={song.trackId} className="flex justify-between items-center border p-4 rounded-lg shadow-md bg-white">
                    <div className="flex items-center space-x-4">
                      <img
                        src={song.artworkUrl100}
                        alt={song.trackName}
                        className="w-20 h-20 rounded"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold">{song.trackName} - {song.artistName}</span>
                        <span className="text-sm text-gray-500">Points: {song.points}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSelectSong(song)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Deselect
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Song results */}
        {!showCatalog && (
          <ul className="space-y-4">
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
                  <p className="text-sm text-gray-600">
                    Points:{" "}
                    <input
                      type="number"
                      value={item.points}
                      onChange={(e) =>
                        handleEditPoints(item.trackId, Number(e.target.value))
                      }
                      className="w-16 p-1 border rounded"
                    />
                  </p>
                </div>
                {item.previewUrl && (
                  <audio controls className="ml-4">
                    <source src={item.previewUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                )}
                <button
                  onClick={() => toggleSelectSong(item)}
                  className={`ml-4 px-4 py-2 rounded ${selectedSongs.some((song) => song.trackId === item.trackId) ? 'bg-green-500' : 'bg-gray-500'}`}
                >
                  {selectedSongs.some((song) => song.trackId === item.trackId) ? 'Deselect' : 'Select'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
