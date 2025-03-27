"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";

export default function ITunesSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [purchasedSongs, setPurchasedSongs] = useState<any[]>([]);
  const [showCatalog, setShowCatalog] = useState(true);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  async function handleSearch() {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&limit=10`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setResults(
        data.results.map((item: any) => ({
          ...item,
          points: Math.floor(Math.random() * 100) + 1,
        }))
      );
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

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

    setPurchasedSongs((prevPurchasedSongs) => [...prevPurchasedSongs, ...cart]);
    setCart([]);
  };

  return (
    <div className="flex flex-col h-screen">
      <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
        <div className="flex gap-4">
          <Link href="/driver/home">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Home</button>
          </Link>
          <Link href="/aboutpage">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">About Page</button>
          </Link>
          <button
            onClick={() => setShowCatalog(true)}
            className={`${showCatalog ? "bg-blue-600" : "bg-gray-700"} px-4 py-2 rounded text-white`}
          >
            Catalog
          </button>
          <button
            onClick={() => setShowCatalog(false)}
            className={`${!showCatalog ? "bg-blue-600" : "bg-gray-700"} px-4 py-2 rounded text-white`}
          >
            My Songs
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handlePurchase} className="text-xl">🛒 Purchase ({cart.length})</button>

          <div className="relative" ref={dropdownRef}>
            <div className="cursor-pointer text-2xl" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <FaUserCircle />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
                <button onClick={handleProfileClick} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                  My Profile
                </button>
                <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-xl mx-auto p-4 flex-grow">
        <h1 className="text-2xl font-bold mb-4 text-center">{showCatalog ? "Catalog" : "My Songs"}</h1>

        {showCatalog ? (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for songs..."
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
                <li key={item.trackId} className="border p-3 rounded shadow flex items-start space-x-4">
                  <img src={item.artworkUrl100} alt={item.trackName} className="w-24 h-24 rounded" />
                  <div className="flex-grow">
                    <p className="font-bold">{item.trackName}</p>
                    <p className="text-sm text-gray-600">By: {item.artistName}</p>
                    <p className="text-sm text-gray-600">Points: {item.points}</p>
                    {item.previewUrl && (
                      <audio controls className="w-full mt-2">
                        <source src={item.previewUrl} type="audio/mpeg" />
                      </audio>
                    )}
                    <button onClick={() => handleAddToCart(item)} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
                      Add to Cart
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <ul className="mt-4 space-y-4">
            {purchasedSongs.length === 0 ? (
              <p>You don't have any songs in your library.</p>
            ) : (
              purchasedSongs.map((song) => (
                <li key={song.trackId} className="border p-3 rounded shadow flex items-start space-x-4">
                  <img src={song.artworkUrl100} alt={song.trackName} className="w-24 h-24 rounded" />
                  <div className="flex-grow">
                    <p className="font-bold">{song.trackName}</p>
                    <p className="text-sm text-gray-600">By: {song.artistName}</p>
                    {song.previewUrl && (
                      <audio controls className="w-full mt-2">
                        <source src={song.previewUrl} type="audio/mpeg" />
                      </audio>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </main>
    </div>
  );
}
