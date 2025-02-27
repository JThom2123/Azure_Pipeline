"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAuthSession, signIn, signOut, getCurrentUser, signUp } from "aws-amplify/auth";


export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    try {
      await signUp({
        username: email, // Cognito requires "username" for email sign-up
        password,
        attributes: { email },
      });
      router.push("/confirm-signup"); // Redirect to confirm sign-up page
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleConfirm = async () => {
    try {
      await Auth.confirmSignUp(email, code);
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      {!isConfirming ? (
        <>
          <input
            className="border p-2 mb-2"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border p-2 mb-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSignUp}>
            Sign Up
          </button>
        </>
      ) : (
        <>
          <input
            className="border p-2 mb-2"
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleConfirm}>
            Confirm
          </button>
        </>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
