import { Amplify } from "aws-amplify";
import { signIn as amplifySignIn, signUp as amplifySignUp, confirmSignUp, signOut } from "aws-amplify/auth";
import awsExports from "@/amplify_outputs.json"; // Ensure this is correctly set up

// Configure Amplify
Amplify.configure(awsExports);

/**
 * Sign up a new user with email and password.
 */
export async function signUp(email: string, password: string) {
  try {
    const { userId } = await amplifySignUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    });
    return { success: true, userId };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Confirm sign-up with a verification code.
 */
export async function confirmUserSignUp(email: string, code: string) {
  try {
    await confirmSignUp({
      username: email,
      confirmationCode: code,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Sign in a user with email and password.
 */
export async function signIn(email: string, password: string) {
  try {
    const user = await amplifySignIn({
      username: email,
      password,
    });
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Sign out the current user.
 */
export async function signOutUser() {
  try {
    await signOut();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
