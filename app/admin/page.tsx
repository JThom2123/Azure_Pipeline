"use client";
import { useRouter } from "next/navigation";
import { signOut } from "@/amplify/auth/resource";

export default function AdminHomePage() {
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/welcome");
    };

    return (
        <div className="card">
            <h2>Admin Home</h2>
            <p>Welcome to the admin panel!</p>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    );
}
