"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Authenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";
import Link from "next/link";

interface User {
  // Adjust field names based on your database schema.
  userID: number;
  userType: string;
  email: string;
  // will add more later like below but doing small stuff for testing now
  // sponsorCompany?: string;
  // connectedDrivers?: any[];
}

export default function ReviewUserPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userEmail = searchParams.get("email");

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [userType, setUserType] = useState<string>(""); // testing with just user type

  // Fetch the user details from your API using the email query parameter
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userEmail) {
          setError("No email provided.");
          setLoading(false);
          return;
        }
        // The URL below should match your GET endpoint that returns a user based on email
        const res = await fetch(
          `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user/${encodeURIComponent(
            userEmail
          )}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch user details (status: ${res.status}).`);
        }
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setUserData(data[0]);
          setUserType(data[0].userType);
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
  }, [userEmail]);

  // Handler to update the user (PATCH request)
  const handleUpdate = async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(
        `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            userType: userType,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Update failed: ${errorText}`);
      }
      alert("User updated successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // Handler to delete the user (DELETE request)
  const handleDelete = async () => {
    if (!userEmail) return;
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    try {
      const res = await fetch(
        `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user/${encodeURIComponent(
          userEmail
        )}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Delete failed: ${errorText}`);
      }
      alert("User deleted successfully.");
      router.push("/admin/home");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="p-10">
          <h1 className="text-4xl font-bold mb-4">Review User</h1>
          {loading ? (
            <p>Loading user details...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : userData ? (
            <div className="space-y-4">
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
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              {/* need to add additional fields as needed for sponsors or drivers */}
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
