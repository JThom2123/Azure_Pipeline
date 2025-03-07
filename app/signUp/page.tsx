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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null); // Track role selection
  const router = useRouter();

  const fetchUserRole = useCallback(async (user: any) => {
    if (!user) {
      console.error("User is not authenticated, skipping fetchUserAttributes()");
      return null;
    }
    try {
      setIsLoading(true);
      const attributes = await fetchUserAttributes();
      const role = attributes?.["custom:role"] || null;
      setUserRole(role);
      console.log("User Role:", role);
      return role;
    } catch (error) {
      console.error("Error fetching user attributes:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getHomePage = (role: string | null) => {
    if (role === "Administrator") return "/admin/home";
    if (role === "Driver") return "/driver/home";
    if (role === "Sponsor") return "/sponsor/home";
    return null;
  };

  return (
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
                  options={["Driver", "Sponsor", "Administrator"]}
                  onChange={(e) => setSelectedRole(e.target.value)} // Update state on change
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
      {({ signOut, user }) => {
        if (user && !userRole) {
          fetchUserRole(user);
        }

        if (userRole) {
          const homePage = getHomePage(userRole);
          if (homePage) {
            router.replace(homePage);
          }
        }

        const handleSignOut = () => {
          signOut?.();
          router.replace("/");
        };

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
