"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAuthSession, signIn, signOut, getCurrentUser, AuthUser } from "aws-amplify/auth";


export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser: AuthUser = await getCurrentUser(); 
        setUser(currentUser);
      } catch (error) {
        router.push("/login"); // Redirect to login if not authenticated
      }
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  if (!user) return <p className="text-center">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Welcome Admin, {user.username}!</h1>
      <p className="text-lg mb-6">You are logged in.</p>
      <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
