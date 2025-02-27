"use client";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
    const router = useRouter();

    return (
        <div className="card">
            <h1>Welcome to Our Web App</h1>
            <p>Please sign in or sign up to continue.</p>
            <button onClick={() => router.push("/signup")}>Sign Up</button>
            <button onClick={() => router.push("/signin")}>Sign In</button>
        </div>
    );
}
