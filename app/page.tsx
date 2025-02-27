"use client";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Our App</h1>
      <p className="text-lg mb-6">Please log in or sign up to continue.</p>
      <div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => router.push("/signup")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
