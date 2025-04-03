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
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false); // Cart dropdown state
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false); // Profile dropdown state
  const [pointsDropdownOpen, setPointsDropdownOpen] = useState(false); // Points dropdown state
  const [cart, setCart] = useState<any[]>([]);
  const [purchasedSongs, setPurchasedSongs] = useState<any[]>([]);
  const [selectedSponsor, setSelectedSponsor] = useState<string>("Sponsor1");
  const [sponsorsPoints, setSponsorsPoints] = useState<{ [key: string]: number }>({
    Sponsor1: 50,
    Sponsor2: 200,
  });
  const [selectedAlbum, setSelectedAlbum] = useState<{ album: string; genre: string } | null>(null);
  const [showCatalog, setShowCatalog] = useState(true);

  const router = useRouter();
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const pointsDropdownRef = useRef<HTMLDivElement>(null);

  // Handle search
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
    } finally {
      setLoading(false);
    }
  }

  // Handle song click to show album description
  const handleSongClick = (song: any) => {
    setSelectedAlbum({ album: song.collectionName, genre: song.primaryGenreName });
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleSignOut = () => {
    router.replace("/");
  };

  const handleAddToCart = (song: any) => {
    setCart((prevCart) => [...prevCart, song]);
  };

  const handleRemoveFromCart = (songId: number) => {
    setCart((prevCart) => prevCart.filter((song) => song.trackId !== songId));
  };

  const handlePurchase = () => {
    const userPoints = sponsorsPoints[selectedSponsor];
    const totalPointsRequired = cart.reduce((total, song) => total + song.points, 0);

    if (totalPointsRequired > userPoints) {
      alert("You do not have enough points to purchase all items in the cart.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const songTitles = cart.map((song) => song.trackName || song.collectionName).join(", ");
    alert(`Purchased the following songs: ${songTitles}`);

    setPurchasedSongs((prevPurchasedSongs) => [...prevPurchasedSongs, ...cart]);
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle dropdown click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target as Node)) &&
        (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) &&
        (pointsDropdownRef.current && !pointsDropdownRef.current.contains(event.target as Node))
      ) {
        setCartDropdownOpen(false);
        setProfileDropdownOpen(false);
        setPointsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
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
            className={`${showCatalog ? "bg-blue-600" : "bg-gray-700"
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

        {/* Cart Dropdown */}
        <div className="relative ml-auto" ref={cartDropdownRef}>
          <button
            onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
            className="text-xl"
          >
            🛒 Cart ({cart.length})
          </button>

          {cartDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded shadow-lg max-h-80 overflow-y-auto z-50">
              <ul>
                {cart.length === 0 ? (
                  <li className="p-4 text-center text-gray-500">Your cart is empty</li>
                ) : (
                  cart.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center p-3 space-x-2 border-b"
                    >
                      <img
                        src={item.artworkUrl100}
                        alt={item.trackName || item.collectionName}
                        className="w-12 h-12 rounded"
                      />
                      <div className="flex-grow">
                        <p className="font-bold">{item.trackName || item.collectionName}</p>
                        <p className="text-sm text-gray-600">By: {item.artistName}</p>
                        <p className="text-sm text-gray-600">Points: {item.points}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.trackId)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </li>
                  ))
                )}
              </ul>
              <div className="flex justify-between p-3">
                <button
                  onClick={handlePurchase}
                  className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                >
                  Purchase
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <div
            className="cursor-pointer text-2xl"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          >
            <FaUserCircle />
          </div>

          {profileDropdownOpen && (
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

      <main className="max-w-xl mx-auto p-4 flex-grow">
        <h1 className="text-2xl font-bold mb-4 text-center">{showCatalog ? "Catalog" : "My Songs"}</h1>

        {/* Catalog search and display */}
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
            <li
              key={item.trackId || item.collectionId}
              className="border p-3 rounded shadow flex items-start space-x-4 cursor-pointer"
              onClick={() => handleSongClick(item)}
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
              <button
                onClick={() => handleAddToCart(item)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add to Cart
              </button>
            </li>
          ))}
        </ul>

        {selectedAlbum && (
          <div className="fixed bottom-5 left-5 bg-gray-800 text-white p-4 rounded shadow-lg">
            <p className="font-bold">Album: {selectedAlbum.album}</p>
            <p>Genre: {selectedAlbum.genre}</p>
            <button
              onClick={() => setSelectedAlbum(null)}
              className="mt-2 bg-red-500 px-3 py-1 rounded text-white"
            >
              Close
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
