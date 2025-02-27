import { Amplify, signIn, signUp, confirmSignUp, signOut } from "aws-amplify";
import awsExports from "../aws-exports"; 

// Configure Amplify
Amplify.configure(awsExports);

/**
 * Function to handle user sign-up
 */
export async function userSignUp(username: string, password: string, email: string) {
  return signUp({
    username,
    password,
    attributes: { email },
  });
}

/**
 * Function to handle user sign-in
 */
export async function userSignIn(username: string, password: string) {
  return signIn({ username, password });
}

/**
 * Function to confirm sign-up
 */
export async function userConfirmSignUp(username: string, code: string) {
  return confirmSignUp({ username, code });
}

/**
 * Function to sign out the user
 */
export async function userSignOut() {
  return signOut();
}
