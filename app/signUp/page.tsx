"use client";

import { useState, useEffect } from "react";
import { Authenticator, TextField, SelectField } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { fetchUserAttributes } from "aws-amplify/auth";
import "@aws-amplify/ui-react/styles.css";
import outputs from "../../amplify_outputs.json";
import { useRouter } from "next/navigation";

Amplify.configure(outputs);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  
  useEffect(() => {
    if (!user) return;

    const fetchUserRole = async () => {
      try {
        console.log("User authenticated:", user);
        const attributes = await fetchUserAttributes();
        const role = attributes?.["custom:role"] || null;

        if (!role) {
          console.error("User role not found in attributes:", attributes);
          setIsLoading(false);
          return;
        }

        console.log("User Role:", role);
        setUserRole(role);
        setIsLoading(false);

        // Redirect based on user role
        if (role === "Administrator") {
          router.replace("/admin/home");
        } else if (role === "Driver") {
          router.replace("/driver/home");
        } else if (role === "Sponsor") {
          router.replace("/sponsor/home");
        } else {
          console.error("Error: User role is missing.");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user, router]); // Runs only when `user` changes

  return (
    <Authenticator
      initialState="signUp"
      components={{
        SignUp: {
          FormFields() {
            return (
              <>
                {/* Default Sign-Up Fields */}
                <Authenticator.SignUp.FormFields />

                {/* Address Field */}
                <TextField
                  name="address"
                  label="Address"
                  placeholder="Enter your home address"
                  required
                />

                {/* Role Selection Dropdown */}
                <SelectField
                  name="custom:role"
                  label="Select Your Role"
                  options={["Driver", "Sponsor", "Administrator"]}
                  required
                />
              </>
            );
          },
        },
      }}
    >
      {({ signOut, user: authenticatedUser }) => {
        
        useEffect(() => {
          if (authenticatedUser && authenticatedUser !== null) {
            console.log("Setting user state:", authenticatedUser);
            setUser(authenticatedUser);
          }
        }, [authenticatedUser]); // Runs only when `authenticatedUser` changes

        const handleSignOut = () => {
          signOut?.();
          router.replace("/");
        };

        if (!authenticatedUser) {
          return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
              <h1 className="text-2xl font-semibold">Authenticating...</h1>
            </div>
          );
        }

        return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-6">Redirecting...</h1>

            {isLoading ? (
              <p className="text-lg text-gray-700 mb-4">Loading user role...</p>
            ) : (
              <p className="text-lg text-red-600 mb-4">
                Error: User role not found.
              </p>
            )}

            <button
              onClick={handleSignOut}
              className="px-6 py-3 border border-gray-500 rounded-md hover:bg-gray-200"
            >
              Log Out
            </button>
          </div>
        );
      }}
    </Authenticator>
  );
}
