"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { fetchUserAttributes } from "aws-amplify/auth";
import Link from "next/link";

export default function ITunesSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [pointsDropdownOpen, setPointsDropdownOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [purchasedSongs, setPurchasedSongs] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showCatalog, setShowCatalog] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sponsorData, setSponsorData] = useState<{ sponsorCompanyName: string; totalPoints: number }[] | null>(null);
  const [selectedSponsor, setSelectedSponsor] = useState<string | null>(null);
  const [selectedSong, setSelectedSong] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sponsorCat, setSponsorCat] = useState<{ catalogID: number; companyName: string }[] | null>(null);
  const [song_ids, setSongIds] = useState<string[]>([]);

  const router = useRouter();
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const pointsDropdownRef = useRef<HTMLDivElement>(null);

  const [impersonatedEmail, setImpersonatedEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("impersonatedDriverEmail");
      setImpersonatedEmail(storedEmail);
    }
    getUserEmailAndSponsorData();
  }, []);

  const getUserEmailAndSponsorData = async () => {
    setLoading(true);
    try {
      const attributes = await fetchUserAttributes();
      const email = attributes.email;
      setUserEmail(email || null);

      const res = await fetch(
        `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user/points?email=${email}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch sponsor data");
      }

      const data: any[] = await res.json();
      console.log("Data returned from API:", data);

      if (!data || data.length === 0) {
        setSponsorData(null);
      } else {
        const groupedData = data.reduce<Record<string, number>>((acc, record) => {
          const sponsorName = record.sponsorCompanyName;
          const points = Number(record.totalPoints ?? record.points);
          if (acc[sponsorName] !== undefined) {
            acc[sponsorName] += points;
          } else {
            acc[sponsorName] = points;
          }
          return acc;
        }, {});

        const sponsorArray = Object.entries(groupedData).map(([sponsorCompanyName, points]) => ({
          sponsorCompanyName,
          totalPoints: points,
        }));

        setSponsorData(sponsorArray);
        if (sponsorArray.length > 0) {
          setSelectedSponsor(sponsorArray[0].sponsorCompanyName);
        }
      }
    } catch (err) {
      console.error("Error fetching sponsor info:", err);
      setError("Could not load sponsor info.");
    } finally {
      setLoading(false);
    }
  };

  // Get catalog from the selected sponsor
  const getCatalog = async () => {
    try {
      const safeSponsor = selectedSponsor ?? "Unknown";

      const response = await fetch(
        `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/catalogue?company_name=${encodeURIComponent(safeSponsor)}&Limit=10&Page=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch catalog");
      }
      
      const data = await response.json();
      const ids: string[] = (data.catalogue?.songs || []).map((song: any) => song.song_id);
      console.log("Returned song IDs:", ids);
      setSongIds(ids);
    } catch (err: any) {
      console.error("Error fetching song IDs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Use song IDs to fetch data from iTunes API
  useEffect(() => {
    if (song_ids.length > 0) {
      fetchSongsFromItunes();
    }
  }, [song_ids]);

  const fetchSongsFromItunes = async () => {
    setLoading(true);
    try {
      const ids = song_ids.join(",");
      const response = await fetch(
        `https://itunes.apple.com/lookup?id=${ids}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch songs from iTunes");
      }

      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
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
  };

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
    if (!selectedSponsor) {
      alert("Please select a sponsor.");
      return;
    }

    const selectedSponsorData = sponsorData?.find(sponsor => sponsor.sponsorCompanyName === selectedSponsor);

    if (!selectedSponsorData) {
      alert("Sponsor not found.");
      return;
    }

    const userPoints = selectedSponsorData.totalPoints;
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

  const handleSongClick = (song: any) => {
    setSelectedSong(song);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSong(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCatalogToggle = () => {
    setShowCatalog((prev) => !prev);
  };

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Search for songs"
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="sponsor-selector">
        <select
          value={selectedSponsor ?? ""}
          onChange={(e) => {
            setSelectedSponsor(e.target.value);
            getCatalog(); // Fetch catalog based on selected sponsor
          }}
        >
          {sponsorData?.map((sponsor) => (
            <option key={sponsor.sponsorCompanyName} value={sponsor.sponsorCompanyName}>
              {sponsor.sponsorCompanyName}
            </option>
          ))}
        </select>
      </div>

      <div className="catalog-toggle">
        <button onClick={handleCatalogToggle}>
          {showCatalog ? "Hide Catalog" : "Show Catalog"}
        </button>
      </div>

      {showCatalog && sponsorCat && (
        <div className="catalog-list">
          <h3>{selectedSponsor} Catalog</h3>
          {sponsorCat.map((song) => (
            <div key={song.catalogID} className="catalog-item">
              <span>{song.companyName}</span>
              <button onClick={() => handleAddToCart(song)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="results-container">
        <h2>Search Results</h2>
        {results.length === 0 && !loading && !error && <p>No songs found.</p>}
        {results.map((song) => (
          <div key={song.trackId} className="result-item">
            <img src={song.artworkUrl100} alt={song.trackName} />
            <div className="song-details">
              <h3>{song.trackName}</h3>
              <p>{song.artistName}</p>
              <button onClick={() => handleAddToCart(song)}>
                Add to Cart ({song.points} points)
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-container">
        <h3>Cart</h3>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cart.map((song) => (
              <div key={song.trackId} className="cart-item">
                <p>{song.trackName}</p>
                <button onClick={() => handleRemoveFromCart(song.trackId)}>
                  Remove
                </button>
              </div>
            ))}
            <button onClick={handlePurchase}>Proceed to Checkout</button>
          </div>
        )}
      </div>

      {modalOpen && selectedSong && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedSong.trackName}</h3>
            <audio
              controls
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            >
              <source src={selectedSong.previewUrl} type="audio/mpeg" />
            </audio>
            <div>
              <p>{selectedSong.artistName}</p>
              <p>Duration: {Math.round(duration)} seconds</p>
              <p>Current Time: {Math.round(currentTime)} seconds</p>
            </div>
            <button onClick={handleModalClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
