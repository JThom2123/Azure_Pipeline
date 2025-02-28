"use client";

import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome Mother Trucker!</h1>
      <p className="text-lg text-gray-600 mb-8">Please sign in or sign up to continue.</p>
      
      <div className="flex space-x-4">
        <button
          onClick={() => router.push("/signIn")}
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push("/signUp")}
          className="px-6 py-3 border border-gray-500 rounded-md hover:bg-gray-200"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}