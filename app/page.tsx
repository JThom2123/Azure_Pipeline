"use client"

import { Authenticator, TextField } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import outputs from "../amplify_outputs.json";
import Link from 'next/link';

Amplify.configure(outputs);



export default function App() {
  return (
    <Authenticator
    // Default to Sign Up screen
    initialState="signUp"
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

            <TextField
                  name="password"
                  label="Password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
            <div style={{ marginTop: "10px" }}>
                  <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                    {passwordCriteria.map(({ label, regex }) => (
                      <li
                        key={label}
                        style={{
                          color: isCriteriaMet(regex) ? "green" : "red",
                          textDecoration: isCriteriaMet(regex)
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
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