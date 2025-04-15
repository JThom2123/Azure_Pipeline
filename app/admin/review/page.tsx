"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Authenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";
import Link from "next/link";

// Define a User interface – adjust field names as needed.
interface User {
  userID: number;
  userType: string;
  email: string;
  // Add additional fields as necessary.
}

export default function ReviewUserPage() {
  const router = useRouter();

  // Instead of useSearchParams, we store the email from the URL in state.
  const [emailParam, setEmailParam] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // On client-side mount, parse window.location.search to get the "email" query param.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const email = params.get("email");
      setEmailParam(email);
    }
  }, []);

  // Fetch user details once we have the email parameter.
  useEffect(() => {
    const fetchUser = async () => {
      if (!emailParam) {
        setError("No email provided.");
        setLoading(false);
        return;
      }
      try {
        // Adjust this URL to match your GET endpoint that returns a user by email.
        const res = await fetch(
          `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user/${encodeURIComponent(
            emailParam
          )}`
        );
        if (!res.ok) {
          throw new Error(`Failed to fetch user details (status: ${res.status}).`);
        }
        const data = await res.json();
        // Assume your API returns an array of user objects; use the first one.
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

    if (emailParam) {
      fetchUser();
    }
  }, [emailParam]);

  // Handler to update the user (PATCH request)
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
            userType: userType,
          }),
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Update failed: ${errorText}`);
      }
      alert("User updated successfully!");
      // Optionally, re-fetch the user details here.
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // Handler to delete the user (DELETE request)
  const handleDelete = async () => {
    if (!emailParam) return;
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const res = await fetch(
        `https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user/${encodeURIComponent(
          emailParam
        )}`,
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
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <Suspense fallback={<div>Loading review page...</div>}>
      <Authenticator>
        {({ signOut }) => (
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
                {/* Additional user fields can be added here */}
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
    </Suspense>
  );
}
