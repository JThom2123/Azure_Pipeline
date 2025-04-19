"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { fetchUserAttributes } from "aws-amplify/auth";
import Link from "next/link";
import { Authenticator } from "@aws-amplify/ui-react";

interface Song {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  previewUrl: string;
  artworkUrl100: string;
  trackPrice: number;
  points?: number;
}

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
  const [sponsorCat, setSponsorCat] = useState<{
    song_id: string;
    title: string;
    artist: string;
    album: string;
    artwork_url: string;
    preview_url: string;
    store_url: string;
    release_date: string;
    genre: string;
    points?: number;
  }[] | null>(null);
  const [song_id, setSong] = useState<string[]>([]);

  const router = useRouter();
  const cartDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const pointsDropdownRef = useRef<HTMLDivElement>(null);

  // New state for impersonated email from localStorage.
  const [impersonatedEmail, setImpersonatedEmail] = useState<string | null>(null);


  // Use useEffect to safely access localStorage on the client side.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("impersonatedDriverEmail");
      if (storedEmail) {
        setImpersonatedEmail(storedEmail);
        setUserEmail(storedEmail);
      } else {
        // If not impersonating, fetch user email from Cognito.
        const getUserEmail = async () => {
          try {
            const attributes = await fetchUserAttributes();
            const email = attributes.email;
            setUserEmail(email || "");
          } catch (err) {
            console.error("Error fetching user attributes:", err);
          }
        };
        getUserEmail();
      }
    }
  }, []);

  useEffect(() => {
    const getUserEmailAndSponsorData = async () => {
      try {
        if (!userEmail) return;

        const res = await fetch(
          `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user/points?email=${userEmail}`
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

    getUserEmailAndSponsorData();
  }, [userEmail]);

  //get catalog
  const getCatalog = async () => {
    setLoading(true);
    try {
      const safeSponsor = selectedSponsor ?? "Unknown";
      const response = await fetch(
        `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/catalogue/?company_name=${encodeURIComponent(safeSponsor)}`,
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
      const songs = data.catalogue?.songs || [];

      if (songs.length === 0) {
        setSponsorCat([]);
        return;
      }

      // Get all song_ids, batch them in chunks of 10 to query iTunes
      const songIds = songs.map((song: any) => song.song_id).filter(Boolean);
      const idChunks = [];
      for (let i = 0; i < songIds.length; i += 10) {
        idChunks.push(songIds.slice(i, i + 10));
      }

      const fetchedSongs = [];
      for (const chunk of idChunks) {
        const iTunesResponse = await fetch(
          `https://itunes.apple.com/lookup?id=${chunk.join(",")}`
        );
        const iTunesData = await iTunesResponse.json();
        fetchedSongs.push(...iTunesData.results);
      }

      setSponsorCat(fetchedSongs);
      console.log("Final catalog:", fetchedSongs);
    } catch (err: any) {
      console.error("Error fetching song IDs or iTunes data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  

  //purchase songs
  const handlePurchase = async (songId: string, catalogueId: string) => {
    const email = localStorage.getItem("userEmail"); // Ensure this is the correct way to get the user's email
    if (!email) {
      alert("User email is required for purchase.");
      return;
    }
  
    const purchaseData = {
      email,
      song_id: songId,
      catalogue_id: catalogueId,
    };
  
    try {
      const response = await fetch(`https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1//catalogue/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("Purchase successful:", data);
        alert(`Successfully purchased the song! Your new points balance is: ${data.data.new_points}`);
      } else {
        console.error("Error during purchase:", data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Network or server error:", error);
      alert("There was an issue processing your purchase.");
    }
  };

  // Fetch catalog whenever sponsor changes
  useEffect(() => {
    if (selectedSponsor) {
      getCatalog();
    }
  }, [selectedSponsor]);


  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

  setLoading(true);
  setError("");

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&limit=20`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    // Filter search results to only show songs from sponsorCat
    const filteredResults = data.results.filter((song: any) =>
      sponsorCat?.some((catalogSong) => String(catalogSong.song_id) === String(song.trackId))
    );

    // Add point data from sponsorCat
    const enrichedResults = filteredResults.map((song: any) => {
      const catalogSong = sponsorCat?.find((c) =>
        String(c.song_id) === String(song.trackId)
      );

      return {
        ...song,
        points: catalogSong?.points || Math.floor(Math.random() * 100) + 1, // Default to random points if not available
      };
    });

    setResults(enrichedResults);
  } catch (err) {
    console.error("Search error:", err);
    setError("Something went wrong. Please try again.");
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
  /*
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
  */
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

  return (
    <Authenticator>
      {({ signOut, user }) => {
        const handleSignOut = () => {
          signOut?.();
          router.replace("/");
        };

        const handleProfileClick = () => {
          router.push("/profile");
        };
        return (
          <div className="flex flex-col h-screen">
            {/* Impersonation Banner */}
            {localStorage.getItem("impersonatedDriverEmail") && (
              <div className="bg-yellow-200 p-4 text-center">
                <p className="text-lg font-semibold">
                  You are impersonating{" "}
                  <span className="underline">{localStorage.getItem("impersonatedDriverEmail")}</span>. Go to Home Page to stop impersonation.
                </p>
              </div>
            )}

            {/* Navigation Bar */}
            <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
              {/* Left side buttons */}
              <div className="flex gap-4">
                <Link href="/driver/home"><button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Home</button></Link>
                <Link href="/aboutpage"><button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">About Page</button></Link>
                <button onClick={() => setShowCatalog(true)} className={`${showCatalog ? "bg-blue-600" : "bg-gray-700"} px-4 py-2 rounded text-white`}>Catalog</button>
                <Link href="/driver/points"><button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Points</button></Link>
                <Link href="/driver/driver_app"><button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Application</button></Link>
              </div>

              {/* Cart dropdown */}
              <div className="relative ml-auto" ref={cartDropdownRef}>
                <button onClick={() => setCartDropdownOpen(!cartDropdownOpen)} className="text-xl">🛒 Cart ({cart.length})</button>
                {cartDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded shadow-lg max-h-80 overflow-y-auto z-50">
                    <ul>
                    {cart.length === 0 ? (
                        <li className="p-4 text-center text-gray-500">Your cart is empty</li>
                      ) : (
                        cart.map((item, index) => (
                          <li
                            key={index}
                            className="flex flex-col items-center p-4 space-y-3 border-b w-full"
                          >
                            <img
                              src={item.artworkUrl100 || item.artwork_url}
                              alt={item.trackName || item.title}
                              className="w-16 h-16 rounded shadow"
                            />
                            <div className="text-center space-y-1">
                              <p className="font-semibold text-base break-words">
                                {item.trackName || item.title}
                              </p>
                              <p className="text-sm text-gray-600 break-words">
                                By: {item.artistName || item.artist}
                              </p>
                              <p className="text-sm text-gray-600">Points: {item.points}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 pt-2 w-full justify-center">
                              <button
                                onClick={() => handleRemoveFromCart(item.trackId)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md text-sm w-full sm:w-auto"
                              >
                                Remove
                              </button>
                              <button
                                onClick={() => handlePurchase(item.trackId, item.catalogueId)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm w-full sm:w-auto"
                              >
                                Purchase
                              </button>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                    <div className="flex justify-between p-3">
                     {/*
                    <button
                      onClick={() => handlePurchase(item.trackId, item.catalogueId)} // Pass the correct songId and catalogueId
                      className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    >
                      Purchase
                    </button>
                          */}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <div className="cursor-pointer text-2xl" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                  <FaUserCircle />
                </div>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
                    <button onClick={handleProfileClick} className="block w-full text-left px-4 py-2 hover:bg-gray-200">My Profile</button>
                    <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Sign Out</button>
                  </div>
                )}
              </div>
            </nav>

            {/* Main content */}
            <main className="max-w-xl mx-auto p-4 flex-grow">
              <h1 className="text-2xl font-bold mb-4 text-center">{showCatalog ? "Catalog" : "My Songs"}</h1>

              {/* Sponsor dropdown */}
              <div className="relative flex justify-center mb-4" ref={pointsDropdownRef}>
                <div className="cursor-pointer text-lg flex items-center gap-2" onClick={() => setPointsDropdownOpen(!pointsDropdownOpen)}>
                  <span>{selectedSponsor || "Select Sponsor"}</span>
                  <span>
                    ({sponsorData && selectedSponsor ? sponsorData.find(s => s.sponsorCompanyName === selectedSponsor)?.totalPoints || 0 : 0} points)
                  </span>
                  <span className="text-xl">&#9660;</span>
                </div>
                {pointsDropdownOpen && (
                  <div className="absolute mt-2 w-40 bg-white text-black rounded shadow-lg">
                    {sponsorData?.map(sponsor => (
                      <div
                        key={sponsor.sponsorCompanyName}
                        onClick={() => {
                          setSelectedSponsor(sponsor.sponsorCompanyName);
                          setPointsDropdownOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      >
                        {sponsor.sponsorCompanyName} ({sponsor.totalPoints} points)
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggle Catalog/My Songs */}
              <div className="flex justify-center gap-4 mb-4">
                <button onClick={() => setShowCatalog(true)} className={`${showCatalog ? "bg-blue-600" : "bg-gray-700"} px-4 py-2 rounded text-white`}>Catalog</button>
                <button onClick={() => setShowCatalog(false)} className={`${!showCatalog ? "bg-blue-600" : "bg-gray-700"} px-4 py-2 rounded text-white`}>My Songs</button>
              </div>

              {/* Catalog View */}
              {showCatalog ? (
                <div className="text-center mt-4">
                <h2 className="font-bold text-lg">{selectedSponsor} Catalog</h2>
                <ul className="mt-4 space-y-4">
                  {Array.isArray(sponsorCat) && sponsorCat.length === 0 ? (
                    <li>No songs found in the catalog.</li>
                  ) : (
                    Array.isArray(sponsorCat) && sponsorCat.map(item => (

                      <li
                        key={item.song_id} // Ensures each list item has a unique "key"
                        className="border p-3 rounded shadow flex items-start space-x-4"
                        onClick={(e) => {
                          // Prevent modal opening when clicking on Add to Cart button
                          if ((e.target as HTMLElement).closest('button')) return;
                          handleSongClick(item); // Open modal if it's not the Add to Cart button
                        }}
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={item.artwork_url}
                            alt={item.title}
                            className="w-24 h-24 rounded"
                          />
                        </div>
                        <div className="flex-grow">
                          <p className="font-bold">{item.title}</p>
                          <p className="text-sm text-gray-600">By: {item.artist}</p>
                          <p className="text-sm text-gray-600">Album: {item.album}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2 w-full">
                          {item.preview_url && (
                            <div className="w-full">
                              <audio controls className="w-full">
                                <source src={item.preview_url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                              <div className="flex justify-between items-center mt-3 w-full">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering modal on button click
                                    handleAddToCart(item); // Add to cart on button click
                                  }}
                                  className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              ) : (
                // My Songs View
                <div className="text-center mt-4">
                  <h2 className="font-bold text-lg">Purchased Songs</h2>
                  <ul className="mt-4 space-y-4">
                    {purchasedSongs.length === 0 ? (
                      <li>No songs purchased yet.</li>
                    ) : (
                      purchasedSongs.map((song, index) => (
                        <li key={index} className="border p-3 rounded shadow flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <img src={song.artwork_url} alt={song.title || song.album} className="w-24 h-24 rounded" />
                          </div>
                          <div className="flex-grow">
                            <p className="font-bold">{song.title || song.album}</p>
                            <p className="text-sm text-gray-600">By: {song.artist}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-2 w-full">
                            <audio controls className="w-full">
                              <source src={song.preview_url} type="audio/mpeg" />
                            </audio>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </main>

            {/* Song modal */}
            {modalOpen && selectedSong && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleModalClose}>
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                  <h2 className="text-xl font-bold mb-4">{selectedSong.trackName}</h2>
                  <p className="text-lg">Album: {selectedSong.collectionName}</p>
                  <p className="text-lg">Genre: {selectedSong.primaryGenreName}</p>
                  <div className="mt-4 flex justify-between items-center">
                    {/* Add to Cart button on the far right */}
                    <button
                      onClick={() => handleAddToCart(selectedSong)} // Calls handleAddToCart when clicked
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Add to Cart
                    </button>
                    <button onClick={handleModalClose} className="bg-red-500 text-white px-4 py-2 rounded">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      }}
    </Authenticator>
  );
};
