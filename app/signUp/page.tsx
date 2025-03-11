"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const router = useRouter();

  /** Fetches user role & email when user is authenticated */
  const fetchUserRole = useCallback(async (authUser: any) => {
    if (!authUser) return;
    try {
      setIsLoading(true);
      const attributes = await fetchUserAttributes();
      const role = attributes?.["custom:role"] || null;
      const email = attributes?.email || null;

      setUserRole(role);
      setUserEmail(email);

      if (isNewUser && role && email) {
        await handleNewUserSignup(email, role);
        setIsNewUser(false);
      }
    } catch (error) {
      console.error("Error fetching user attributes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isNewUser]);

  /** Sends user info to the API upon signup */
  const handleNewUserSignup = async (email: string, userType: string) => {
    try {
      const apiUrl = "https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/user";

      console.log("Sending user data to API:", { email, userType });

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userType }),
      });

      if (response.status === 201) {
        console.log("API Response:", await response.json());
        alert("Your account has been successfully added to the database.");
      } else {
        alert(`Failed to create account. Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error calling the API:", error);
      alert("An error occurred while saving your account. Please try again.");
    }
  };

  /** Determines the home page based on the role */
  const getHomePage = (role: string | null) => {
    if (role === "Admin") return "/admin/home";
    if (role === "Driver") return "/driver/home";
    if (role === "Sponsor") return "/sponsor/home";
    return null;
  };

  /** 🌟 Fetch user role when authentication state changes */
  useEffect(() => {
    if (user) {
      const isFirstTime = sessionStorage.getItem("isNewUser");
      if (isFirstTime === "true") {
        setIsNewUser(true);
        sessionStorage.removeItem("isNewUser"); // Clear flag after first login
      }
      fetchUserRole(user);
    }
  }, [user, fetchUserRole]);

  /** 🌟 Redirect to home page once user role is determined */
  useEffect(() => {
    if (userRole) {
      const homePage = getHomePage(userRole);
      if (homePage) {
        router.replace(homePage);
      }
    }
  }, [userRole, router]);

  return (
    <>
      <Authenticator
        initialState="signUp"
        components={{
          SignUp: {
            FormFields() {
              return (
                <>
                  <Authenticator.SignUp.FormFields />
                  <TextField
                    name="address"
                    label="Address"
                    placeholder="Enter your home address"
                    required
                  />
                  <SelectField
                    name="custom:role"
                    label="Select Your Role"
                    options={["Driver", "Sponsor", "Admin"]}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    required
                  />
                  {selectedRole === "Sponsor" && (
                    <TextField
                      name="custom:sponsorCompany"
                      label="Sponsor Company"
                      placeholder="Enter your sponsor company name"
                      required
                    />
                  )}
                </>
              );
            },
          },
        }}
      >
        {({ signOut, user: authUser }) => {
          if (!user && authUser) {
            setUser(authUser);
          }

          if (isLoading || !userRole) {
            return (
              <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-2xl font-semibold">Loading...</h1>
              </div>
            );
          }

          return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
              <button
                onClick={() => {
                  signOut?.();
                  router.replace("/");
                }}
                className="px-6 py-3 border border-gray-500 rounded-md hover:bg-gray-200"
              >
                Log Out
              </button>
            </div>
          );
        }}
      </Authenticator>
    </>
  );
}
