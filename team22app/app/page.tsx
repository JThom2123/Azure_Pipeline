"use client";
import { useState } from "react";

export default function Home() {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    const descriptionElement = document.querySelector(".product-description");
    if (descriptionElement) {
      descriptionElement.setAttribute("contentEditable", String(!isEditing));
    }
  };

  return (
    <div>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Product Information</title>

      {/* Navigation Bar */}
      <div className="navbar">
        <div className="nav-buttons">
          <button>Home</button>
          <button>Catalog</button>
          <button>Points</button>
          <button>More</button>
        </div>
        <button className="edit-button" onClick={handleEditClick}>
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div className="container">
        {/* Sidebar */}
        <div className="sidebar">
          <h3><u>Project Details</u></h3>
          <p><b>Team Number:</b> <span id="team-number">22</span></p>
          <p><b>Sprint Number:</b> <span id="sprint-number">2</span></p>
          <p><b>Release Date:</b> <span id="release-date">February 6, 2025</span></p>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <h1 className="product-name">Product Name</h1>
          <div id="description-container">
            <div
              className={`product-description ${isEditing ? "editable" : ""}`}
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
            >
              This is the product description. It provides an overview of the product’s features, benefits, and key details.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
