"use client";
import { useEffect, useState } from "react";
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import Link from 'next/link';


interface AboutSection {
  section_name: string;
  content: string;
  last_updated: string;
}

const API_URL = "https://n0dkxjq6pf.execute-api.us-east-1.amazonaws.com/dev1/about";

const AboutPage = () => {
  const [aboutData, setAboutData] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: AboutSection[] = await response.json();
        setAboutData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Our About Page</h1>

      <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      padding: '10px' 
    }}>
      <Link href="/">
                <button>Go to Home Page</button><br />
      </Link>
    </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && aboutData.length > 0 ? (
        <div className="space-y-6">
          {aboutData.map((section, index) => (
            <div key={index} className="border-b pb-4">
              <h2 className="text-xl font-semibold capitalize">
                {section.section_name.replace(/_/g, " ")}
              </h2>
              <p className="text-gray-700">{section.content}</p>
              <small className="text-gray-500">
                Last updated:{" "}
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(section.last_updated))}
              </small>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-gray-600">No data available.</p>
      )}
    </div>
  );
};

export default AboutPage;

