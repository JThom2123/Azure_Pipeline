import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook for navigation

const ProductInfo = () => {
  const [userType, setUserType] = useState<string>("sponsor");
  const navigate = useNavigate(); // Initialize the navigate function

  const toggleUserType = () => {
    if (userType === "admin") {
      setUserType("sponsor");
    } else if (userType === "sponsor") {
      setUserType("driver");
    } else if (userType === "driver") {
      setUserType("admin");
    }
  };

  const redirectToApp = () => {
    if (userType === "driver") {
      window.location.href = "driver_app.html"; // Redirect to driver_app.html for drivers
    } else if (userType === "sponsor") {
      window.location.href = "sponsor_app.html"; // Redirect to sponsor_app.html for sponsors
    } else {
      alert("Invalid user type or no access to an application.");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navigation Bar */}
      <div className="navbar flex justify-between items-center bg-gray-800 p-4 text-white">
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/page")} // Navigate to /page for About
            className="bg-gray-600 px-4 py-2 rounded"
          >
            About
          </button>
          <button
            onClick={redirectToApp} // Redirect based on user type
            className="bg-gray-600 px-4 py-2 rounded"
          >
            Application
          </button>
        </div>
      </div>

      <div className="container flex">
        <div className="sidebar w-64 bg-gray-100 p-4 border-r-2 border-gray-300">
          {/* Sidebar content */}
        </div>
        <div className="main-content flex-grow p-10">
          <h1 className="text-2xl font-bold mb-4">Welcome, Username</h1>

          {/* User Info Based on Role */}
          <div
            className="user-info driver"
            style={{ display: userType === "driver" ? "block" : "none" }}
          >
            <span className="item">Account Type: Driver</span>
            <span className="item">Sponsor name: Walmart</span>
            <span className="item">Current Points: 24</span>
          </div>

          <div
            className="user-info sponsor"
            style={{ display: userType === "sponsor" ? "block" : "none" }}
          >
            <span className="item">Account Type: Sponsor</span>
            <span className="item">Sponsored Drivers List: ...</span>
          </div>

          <div
            className="user-info admin"
            style={{ display: userType === "admin" ? "block" : "none" }}
          >
            <span className="item">Account Type: Admin</span>
            <span className="item">
              You are the best programmer in the world! Keep up the great work!!
            </span>
          </div>

          <button
            className="bg-blue-600 px-4 py-2 text-white rounded mt-4"
            onClick={toggleUserType}
          >
            Toggle User Type
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
