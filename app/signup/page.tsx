"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/amplify/auth/resource";

export default function SignUpPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignUp = async () => {
        try {
            await signUp(email, password);
            router.push("/confirm-signup");
        } catch (err) {
            setError(err.message || "Sign-up failed");
        }
    };

    return (
        <div className="card">
            <h2>Sign Up</h2>
            {error && <p className="error">{error}</p>}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSignUp}>Sign Up</button>
            <p>Already have an account? <a href="/signin">Sign in</a></p>
        </div>
    );
}
