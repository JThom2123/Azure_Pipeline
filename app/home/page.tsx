"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAuthSession, signOut } from "aws-amplify/auth";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null); // Storing username as string

  useEffect(() => {
    const checkUser = async () => {
      try {
        const session = await fetchAuthSession(); // Fetch session instead of getCurrentUser
        const idToken = session.tokens?.idToken; // Get ID token

        if (idToken) {
          setUser(idToken.payload["cognito:username"]); // Extract username
        } else {
          throw new Error("User not authenticated");
        }
      } catch (error) {
        if (typeof window !== "undefined") {
          router.push("/login"); // Redirect to login if not authenticated
        }
      }
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  if (!user) return <p className="text-center">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Welcome Admin, {user}!</h1>
      <p className="text-lg mb-6">You are logged in.</p>
      <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
