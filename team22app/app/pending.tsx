import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const ApplicationStatus = () => {
  const [status, setStatus] = useState("Checking status...");
  const [statusClass, setStatusClass] = useState("pending");
  const router = useRouter();

  useEffect(() => {
    const statuses = ["Accepted", "Denied", "Pending"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    setStatus(randomStatus);

    if (randomStatus === "Accepted") {
      setStatusClass("accepted");
    } else if (randomStatus === "Denied") {
      setStatusClass("denied");
    } else {
      setStatusClass("pending");
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white text-center">
      <h1 className="text-2xl font-bold">Application Status</h1>
      <p className={`text-xl font-bold my-5 ${statusClass}`}>{status}</p>
      <button 
        className="mt-5 px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={() => router.push("homepage.tsx")}
      >
        Return to Home
      </button>
    </div>
  );
};

export default ApplicationStatus;