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
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showCatalog, setShowCatalog] = useState(true);
  const [selectedSponsor, setSelectedSponsor] = useState<string>("Sponsor1");

  // Explicitly typing sponsors
  const [sponsors, setSponsors] = useState<Record<string, { points: number }>>({
    Sponsor1: { points: 50 },
    Sponsor2: { points: 100 },
  });

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    const sponsorPoints = sponsors[selectedSponsor]?.points || 0;
    if (song.points <= sponsorPoints) {
      setCart((prevCart) => [...prevCart, song]);
    } else {
      alert("You do not have enough points for this song.");
    }
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
          <Link href="/driver/points">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Points</button>
          </Link>
          <Link href="/driver/driver_app">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Application</button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handlePurchase} className="text-xl">
            🛒 Purchase ({cart.length})
          </button>

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
        </div>
      </nav>

      <main className="max-w-xl mx-auto p-4 flex-grow">
        <h1 className="text-2xl font-bold mb-4 text-center">{showCatalog ? "Catalog" : "My Songs"}</h1>

        <div className="mb-4 flex justify-center">
          <select
            value={selectedSponsor}
            onChange={(e) => setSelectedSponsor(e.target.value)}
            className="px-4 py-2 rounded"
          >
            {Object.keys(sponsors).map((sponsor) => (
              <option key={sponsor} value={sponsor}>
                {sponsor} (Points: {sponsors[sponsor].points})
              </option>
            ))}
          </select>
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
                <li key={item.trackId} className="border p-3 rounded shadow flex items-start space-x-4">
                  <img src={item.artworkUrl100} alt={item.trackName} className="w-24 h-24 rounded" />
                  <div className="flex-grow">
                    <p className="font-bold">{item.trackName}</p>
                    <p className="text-sm text-gray-600">By: {item.artistName}</p>
                    <p className="text-sm text-gray-600">Points: {item.points}</p>
                  </div>
                  <button onClick={() => handleAddToCart(item)} className="bg-green-500 text-white px-4 py-2 rounded">
                    Add to Cart
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-center text-gray-600">You don't have any songs in your library.</p>
        )}
      </main>
    </div>
  );
}
