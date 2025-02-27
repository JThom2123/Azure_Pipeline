import { Auth } from "aws-amplify";

/**
 * Function to handle user sign-up
 */
export async function signUp({ username, password, email }: { username: string; password: string; email: string }) {
  return Auth.signUp({
    username,
    password,
    attributes: { email },
  });
}

/**
 * Function to handle user sign-in
 */
export async function signIn({ username, password }: { username: string; password: string }) {
  return Auth.signIn(username, password);
}

/**
 * Function to confirm sign-up
 */
export async function confirmSignUp(username: string, code: string) {
  return Auth.confirmSignUp(username, code);
}

/**
 * Function to sign out the user
 */
export async function signOut() {
  return Auth.signOut();
}
