"use client";
import { useEffect, useState } from "react";

interface AboutSection {
  section_name: string;
  content: string;
  last_updated: string;
}

const AboutPage = () => {
  const [aboutData, setAboutData] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://3d52pmbo01.execute-api.us-east-1.amazonaws.com"
        );

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
      <h1 className="text-3xl font-bold mb-4">About Our Product</h1>

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
                {new Date(section.last_updated).toLocaleDateString()}
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


