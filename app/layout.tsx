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
    region: "us-east-1", 
    userPoolId: "us-east-1_SBC9pg6ag", 
    userPoolWebClientId: "107720oslv197r2qvlb4h1ptcs", 
    mandatorySignIn: true,
  }
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
