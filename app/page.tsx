"use client"

import { Authenticator, TextField, useAuthenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import outputs from "../amplify_outputs.json";
import Link from 'next/link';
import { useState } from "react";

Amplify.configure(outputs);

export default function App() {
  
  return (
    <Authenticator
      initialState="signUp"
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
        <main>
            <Link href="/aboutpage">
                <button>Go to About Page</button><br />
            </Link>
            <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}