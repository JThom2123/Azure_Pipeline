"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Authenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";
import Link from "next/link";

// Define interfaces for our data:
interface User {
  userID?: number;
  userType: string;
  email: string;
  name: string;
  "custom:phoneNumber"?: string;
  "custom:zipCode"?: string;
  "custom:sponsorCompany"?: string;
  sponsorCompanyID?: number;
}

interface DriverSponsor {
  sponsorCompanyID: number;
  sponsorCompanyName?: string;
}

interface SponsorDriver {
  driverEmail: string;
}

export default function ReviewUserPage() {
  const router = useRouter();

  // States for user attributes
  const [emailParam, setEmailParam] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [sponsorCompany, setSponsorCompany] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // States for relationship management
  const [driverSponsors, setDriverSponsors] = useState<DriverSponsor[]>([]);
  const [newSponsorID, setNewSponsorID] = useState<string>("");
  const [sponsorDrivers, setSponsorDrivers] = useState<SponsorDriver[]>([]);
  const [newDriverEmail, setNewDriverEmail] = useState<string>("");

  // Companies mapping: sponsorCompanyID (number) -> company_name (string)
  const [companiesMap, setCompaniesMap] = useState<Record<number, string>>({});

  // On client-side mount, parse window.location.search to get the "email" query param.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const email = params.get("email");
      setEmailParam(email);
    }
  }, []);
  
  // Fetch companies mapping from /dev1/companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/companies");
        if (res.ok) {
          const companies = await res.json();
          const map: Record<number, string> = {};
          companies.forEach((comp: any) => {
            map[Number(comp.id)] = comp.company_name;
          });
          setCompaniesMap(map);
        } else {
          console.error("Failed to fetch companies.");
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch user details from GET /dev1/user/{email}
  useEffect(() => {
    const fetchUser = async () => {
      if (!emailParam) {
        setError("No email provided.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user/${encodeURIComponent(emailParam)}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch user details (status: ${res.status}).`);
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const user: User = data[0];
          setUserData(user);
          setName(user.name || "N/A");
          setUserType(user.userType || "");
          setPhoneNumber(user["custom:phoneNumber"] || "");
          setZipCode(user["custom:zipCode"] || "");
          setSponsorCompany(user["custom:sponsorCompany"] || "");
        } else {
          setError("User not found.");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [emailParam]);

  // Fetch relationships for drivers or sponsors
  useEffect(() => {
    const fetchRelationships = async () => {
      if (!emailParam || !userData) return;
      if (userData.userType === "Driver") {
        // For drivers, fetch sponsor companies via driverSponsors endpoint.
        try {
          const res = await fetch(
            `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/driverSponsors?email=${encodeURIComponent(emailParam)}`
          );
          if (res.ok) {
            const data = await res.json();
            const sponsors: DriverSponsor[] = data.map((s: any) => ({
              sponsorCompanyID: Number(s.sponsorCompanyID),
              sponsorCompanyName:
                s.sponsorCompanyName ||
                companiesMap[Number(s.sponsorCompanyID)] ||
                "Unknown",
            }));
            setDriverSponsors(sponsors);
          } else {
            console.error("Failed to fetch driver sponsor relationships.");
          }
        } catch (err) {
          console.error(err);
        }
      } else if (userData.userType === "Sponsor" && userData.sponsorCompanyID) {
        // For sponsors, fetch connected drivers.
        try {
          const res = await fetch(
            `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/driverSponsors?sponsorCompanyID=${userData.sponsorCompanyID}`
          );
          if (res.ok) {
            const data = await res.json();
            setSponsorDrivers(data);
          } else {
            console.error("Failed to fetch sponsor driver relationships.");
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchRelationships();
  }, [emailParam, userData, companiesMap]);

  // Handler: Update user attributes (PATCH /dev1/user)
  const handleUpdate = async () => {
    if (!emailParam) return;
    try {
      const res = await fetch(
        `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailParam,
            name,
            userType,
            "custom:phoneNumber": phoneNumber,
            "custom:zipCode": zipCode,
            "custom:sponsorCompany": sponsorCompany,
          }),
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Update failed: ${errorText}`);
      }
      alert("User updated successfully!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Handler: Delete user (DELETE /dev1/user/{email})
  const handleDelete = async () => {
    if (!emailParam) return;
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const res = await fetch(
        `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user/${encodeURIComponent(emailParam)}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Delete failed: ${errorText}`);
      }
      alert("User deleted successfully.");
      router.push("/admin/home");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Relationship Handlers for Drivers: Add a sponsor
  const handleAddSponsorToDriver = async () => {
    if (!emailParam || !newSponsorID.trim()) {
      alert("Please provide a sponsor company ID to add.");
      return;
    }
    try {
      const res = await fetch(
        `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/driverSponsors`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driverEmail: emailParam,
            sponsorCompanyID: newSponsorID,
          }),
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to add sponsor: ${errorText}`);
      }
      alert("Sponsor added successfully.");
      // Re-fetch driver sponsors
      const fetchRes = await fetch(
        `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/driverSponsors?email=${encodeURIComponent(emailParam)}`
      );
      if (fetchRes.ok) {
        const data = await fetchRes.json();
        const sponsors: DriverSponsor[] = data.map((s: any) => ({
          sponsorCompanyID: Number(s.sponsorCompanyID),
          sponsorCompanyName:
            s.sponsorCompanyName ||
            companiesMap[Number(s.sponsorCompanyID)] ||
            "Unknown",
        }));
        setDriverSponsors(sponsors);
      }
      setNewSponsorID("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Relationship Handler for Drivers: Remove a sponsor
  const handleRemoveSponsorFromDriver = async (sponsorCompanyID: number) => {
    if (!emailParam) return;
    if (!confirm("Are you sure you want to remove this sponsor?")) return;
    try {
      const res = await fetch(
        `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/driverSponsors?driverEmail=${encodeURIComponent(emailParam)}&sponsorCompanyID=${sponsorCompanyID}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to remove sponsor: ${errorText}`);
      }
      alert("Sponsor removed successfully.");
      setDriverSponsors((prev) =>
        prev.filter((s) => s.sponsorCompanyID !== sponsorCompanyID)
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Relationship Handlers for Sponsors: Add a driver
  const handleAddDriverToSponsor = async () => {
    if (!emailParam || !newDriverEmail.trim() || !userData?.sponsorCompanyID) {
      alert("Please provide a driver email to add.");
      return;
    }
    try {
      const res = await fetch(
        `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/driverSponsors`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driverEmail: newDriverEmail,
            sponsorCompanyID: userData.sponsorCompanyID,
          }),
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to add driver: ${errorText}`);
      }
      alert("Driver added successfully.");
      // Re-fetch sponsor drivers
      const fetchRes = await fetch(
        `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/driverSponsors?sponsorCompanyID=${userData.sponsorCompanyID}`
      );
      if (fetchRes.ok) {
        const data = await fetchRes.json();
        setSponsorDrivers(data);
      }
      setNewDriverEmail("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Relationship Handler for Sponsors: Remove a driver
  const handleRemoveDriverFromSponsor = async (driverEmail: string) => {
    if (!userData || !userData.sponsorCompanyID) return;
    if (!confirm("Are you sure you want to remove this driver?")) return;
    try {
      const res = await fetch(
        `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/driverSponsors?driverEmail=${encodeURIComponent(driverEmail)}&sponsorCompanyID=${userData.sponsorCompanyID}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to remove driver: ${errorText}`);
      }
      alert("Driver removed successfully.");
      setSponsorDrivers((prev) =>
        prev.filter((d) => d.driverEmail !== driverEmail)
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <Authenticator>
      {({ signOut }) => (
        <div className="p-10 overflow-y-auto">
          <h1 className="text-4xl font-bold mb-4">Review User</h1>
          {loading ? (
            <p>Loading user details...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : userData ? (
            <div className="space-y-6">
              {/* Display Cognito Attributes */}
              <div>
                <label className="block font-semibold">Name:</label>
                <input
                  type="text"
                  value={name || userData.name || "N/A"}
                  onChange={(e) => setName(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block font-semibold">Email:</label>
                <input
                  type="email"
                  value={userData.email}
                  readOnly
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block font-semibold">User Type:</label>
                <input
                  type="text"
                  className="w-full p-2 border bg-gray-300 rounded cursor-not-allowed"
                  value={userType || userData.userType || ""}
                  readOnly
                  placeholder="User Type (Cannot be changed)"
                />
              </div>
              <div>
                <label className="block font-semibold">Phone Number:</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block font-semibold">Zip Code:</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              {userData.userType === "Sponsor" && userData.sponsorCompanyID && (
                <div>
                  <label className="block font-semibold">Sponsor Company:</label>
                  <input
                    type="text"
                    value={sponsorCompany}
                    onChange={(e) => setSponsorCompany(e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
              )}

              {/* Relationship Management for Drivers */}
              {userData.userType === "Driver" && (
                <div>
                  <h2 className="text-xl font-bold mb-2">Sponsor Companies</h2>
                  {driverSponsors.length > 0 ? (
                    <ul className="space-y-2">
                      {driverSponsors.map((sponsor) => (
                        <li key={sponsor.sponsorCompanyID} className="flex items-center justify-between border p-2 rounded">
                          <span>
                            {sponsor.sponsorCompanyName ||
                              companiesMap[sponsor.sponsorCompanyID] ||
                              "Unknown"}{" "}
                            (ID: {sponsor.sponsorCompanyID})
                          </span>
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => handleRemoveSponsorFromDriver(sponsor.sponsorCompanyID)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No sponsor companies assigned.</p>
                  )}
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={newSponsorID}
                      onChange={(e) => setNewSponsorID(e.target.value)}
                      placeholder="Sponsor Company ID"
                      className="border p-2 rounded"
                    />
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                      onClick={handleAddSponsorToDriver}
                    >
                      Add Sponsor
                    </button>
                  </div>
                </div>
              )}

              {/* Relationship Management for Sponsors */}
              {userData.userType === "Sponsor" && userData.sponsorCompanyID && (
                <div>
                  <h2 className="text-xl font-bold mb-2">Connected Drivers</h2>
                  {sponsorDrivers.length > 0 ? (
                    <ul className="space-y-2">
                      {sponsorDrivers.map((driver) => (
                        <li key={driver.driverEmail} className="flex items-center justify-between border p-2 rounded">
                          <span>{driver.driverEmail}</span>
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => handleRemoveDriverFromSponsor(driver.driverEmail)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No drivers connected.</p>
                  )}
                  <div className="mt-4 flex gap-2">
                    <input
                      type="email"
                      value={newDriverEmail}
                      onChange={(e) => setNewDriverEmail(e.target.value)}
                      placeholder="Driver Email"
                      className="border p-2 rounded"
                    />
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                      onClick={handleAddDriverToSponsor}
                    >
                      Add Driver
                    </button>
                  </div>
                </div>
              )}

              {/* Update and Delete Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Update User
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete User
                </button>
              </div>
            </div>
          ) : null}
          <button
            onClick={() => router.push("/admin/home")}
            className="mt-6 bg-gray-700 text-white px-4 py-2 rounded"
          >
            Back to Admin Home
          </button>
        </div>
      )}
    </Authenticator>
  );
}
