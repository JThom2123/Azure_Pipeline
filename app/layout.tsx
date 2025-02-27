"use client"
import { Inter } from "next/font/google";
import React from "react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


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
        <div className="welcome-container">
          <h1 className="text-4xl font-bold text-center mt-10">Welcome to the Application</h1>
          <p className="text-center text-lg mt-4">Please log in to continue.</p>
        </div>
        {children}
      </body>
    </html>
  );
}
