"use client";

import { Inter } from "next/font/google";
import React from "react";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/** ✅ Manually configure AWS Cognito */
Amplify.configure({
  Auth: {
    region: "us-east-1", // 🔹 Replace with your AWS Region
    userPoolId: "us-east-1_ABC123", // 🔹 Replace with your Cognito User Pool ID
    userPoolWebClientId: "abcdefghij1234567890", // 🔹 Replace with your Cognito App Client ID
    mandatorySignIn: true, // 🔹 Require sign-in before accessing resources
  },
});

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
