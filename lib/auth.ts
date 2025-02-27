import { Amplify } from "aws-amplify";
import {
  signIn,
  signUp,
  confirmSignUp,
  signOut,
} from "@aws-amplify/auth";
import awsExports from "@/aws-exports";

// Configure Amplify Auth
Amplify.configure(awsExports);

// Sign In User
export const userSignIn = async (username: string, password: string) => {
  try {
    const user = await signIn({ username, password });
    return user;
  } catch (error) {
    console.error("Sign-in error:", error);
    throw error;
  }
};

// Sign Up User
export const userSignUp = async (username: string, password: string, email: string) => {
  try {
    const user = await signUp({
      username,
      password,
      options: {
        userAttributes: { email },
      },
    });
    return user;
  } catch (error) {
    console.error("Sign-up error:", error);
    throw error;
  }
};

// Confirm Sign Up
export const userConfirmSignUp = async (username: string, code: string) => {
  try {
    await confirmSignUp({ username, confirmationCode: code });
  } catch (error) {
    console.error("Confirmation error:", error);
    throw error;
  }
};

// Sign Out User
export const userSignOut = async () => {
  try {
    await signOut();
  } catch (error) {
    console.error("Sign-out error:", error);
    throw error;
  }
};
