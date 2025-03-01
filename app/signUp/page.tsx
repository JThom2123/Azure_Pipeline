"use client"

import { Authenticator, TextField } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import outputs from "../../amplify_outputs.json";
import Link from 'next/link';

Amplify.configure(outputs);



export default function App() {
  return (
    <Authenticator
    // Default to Sign Up screen
    initialState="signIn"
    // Customize `Authenticator.SignUp.FormFields`
    components={{
      SignUp: {
        FormFields() {
          return (
            <>
            {/* Re-use default `Authenticator.SignUp.FormFields` */}
            <Authenticator.SignUp.FormFields />
            
            <TextField
            name = "address"
            label = "Address"
            placeholder = "Enter your Home Address"
            />
            </>
            );
        },
    },
    }}>
      {({ signOut, user }) => (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-6">Welcome Mother Trucker! You are Signed In :P</h1>
        
        
        <div className="flex space-x-4">
        <Link href="/admin/home">
              <button className="px-6 py-3 border border-gray-500 rounded-md hover:bg-gray-200">
                Home Page
              </button>
            </Link>

            <Link href="/aboutpage">
              <button className="px-6 py-3 border border-gray-500 rounded-md hover:bg-gray-200">
                About Page
              </button>
            </Link>

          <button
            onClick={signOut}
            className="px-6 py-3 border border-gray-500 rounded-md hover:bg-gray-200"
          >
            Log Out
          </button>
        </div>
      </div>
        
      )}
    </Authenticator>
  );
}