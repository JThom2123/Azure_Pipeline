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
  const [cart, setCart] = useState<any[]>([]); // To store the user's cart
  const [purchasedSongs, setPurchasedSongs] = useState<any[]>([]); // To store purchased songs
  const [currentTime, setCurrentTime] = useState<number>(0); // State for current time of the audio
  const [duration, setDuration] = useState<number>(0); // State for total duration of the audio
  const [showCatalog, setShowCatalog] = useState(true); // State to toggle between catalog and my songs view
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
    router.replace("/");
  };

  const handleAddToCart = (song: any) => {
    setCart((prevCart) => [...prevCart, song]);
  };

  const handlePurchase = () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    const songTitles = cart.map((song) => song.trackName || song.collectionName).join(", ");
    alert(`Purchased the following songs: ${songTitles}`);

    // Add purchased songs to purchasedSongs
    setPurchasedSongs((prevPurchasedSongs) => [...prevPurchasedSongs, ...cart]);

    // Clear cart after purchase
    setCart([]);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.target as HTMLAudioElement;
    setCurrentTime(audio.currentTime);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audio = e.target as HTMLAudioElement;
    setDuration(audio.duration);
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
          <button
            onClick={() => setShowCatalog(true)}
            className={`${
              showCatalog ? "bg-blue-600" : "bg-gray-700"
            } px-4 py-2 rounded text-white`}
          >
            Catalog
          </button>
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

        {/* Cart and Profile Dropdown */}
        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <button onClick={handlePurchase} className="text-xl">
            🛒 Purchase ({cart.length})
          </button>

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
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-xl mx-auto p-4 flex-grow">
        <h1 className="text-2xl font-bold mb-4 text-center">{showCatalog ? "Catalog" : "My Songs"}</h1>

        {/* Toggle Buttons for Catalog and My Songs */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setShowCatalog(true)}
            className={`${
              showCatalog ? "bg-blue-600" : "bg-gray-700"
            } px-4 py-2 rounded text-white`}
          >
            Catalog
          </button>
          <button
            onClick={() => setShowCatalog(false)}
            className={`${
              !showCatalog ? "bg-blue-600" : "bg-gray-700"
            } px-4 py-2 rounded text-white`}
          >
            My Songs
          </button>
        </div>

        {showCatalog ? (
          <>
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
                <li
                  key={item.trackId || item.collectionId}
                  className="border p-3 rounded shadow flex items-start space-x-4"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={item.artworkUrl100}
                      alt={item.trackName || item.collectionName}
                      className="w-24 h-24 rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold">{item.trackName || item.collectionName}</p>
                    <p className="text-sm text-gray-600">By: {item.artistName}</p>
                    <p className="text-sm text-gray-600">Points: {item.points}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2 w-full">
                    {item.previewUrl && (
                      <div className="w-full">
                        <audio
                          controls
                          className="w-full"
                          onTimeUpdate={handleTimeUpdate}
                          onLoadedMetadata={handleLoadedMetadata}
                        >
                          <source src={item.previewUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                        <div className="flex justify-between items-center mt-3 w-full">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="space-y-4">
            {purchasedSongs.length === 0 ? (
              <p>You don't have any songs in your library.</p>
            ) : (
              <ul>
                {purchasedSongs.map((song, index) => (
                  <li key={index} className="border p-3 rounded shadow flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={song.artworkUrl100}
                        alt={song.trackName || song.collectionName}
                        className="w-24 h-24 rounded"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold">{song.trackName || song.collectionName}</p>
                      <p className="text-sm text-gray-600">By: {song.artistName}</p>
                    </div>
                    {song.previewUrl && (
                      <audio controls className="w-full mt-2">
                        <source src={song.previewUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
