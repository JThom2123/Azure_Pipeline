"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { confirmSignUp } from "@/amplify/auth/resource";

export default function ConfirmSignUpPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const handleConfirm = async () => {
        try {
            await confirmSignUp(email, code);
            router.push("/admin");
        } catch (err) {
            setError(err.message || "Verification failed");
        }
    };

    return (
        <div className="card">
            <h2>Confirm Sign Up</h2>
            {error && <p className="error">{error}</p>}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Verification Code" value={code} onChange={(e) => setCode(e.target.value)} />
            <button onClick={handleConfirm}>Confirm</button>
        </div>
    );
}
