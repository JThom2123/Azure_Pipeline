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

              {showCatalog ? (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Your Selected Songs:</h2>
                  {sponsorCat.length === 0 ? (
                    <p className="text-gray-500">You haven't selected any songs yet.</p>
                  ) : (
                    <ul className="space-y-4">
                      {sponsorCat.map((song) => (
                        <li key={song.title} className="flex justify-between items-center border p-4 rounded-lg shadow-md bg-white">
                          <div className="flex items-center space-x-4">
                            <img
                              src={song.artwork_url}
                              alt={song.title}
                              className="w-20 h-20 rounded"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold">{song.title} - {song.artist}</span>
                              <span className="text-sm text-gray-500">Points: {song.price}</span>
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
              ) : (
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
      }}
    </Authenticator>
  );
}
