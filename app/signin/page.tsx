"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Auth } from "aws-amplify";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    try {
      await Auth.signIn(email, password);
      router.push("/admin"); // ✅ Redirect to Admin Page after successful login
    } catch (err) {
      setError(err.message || "Sign-in failed");
    }
  };

  return (
    <div className="card">
      <h2>Sign In</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignIn}>Sign In</button>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}

