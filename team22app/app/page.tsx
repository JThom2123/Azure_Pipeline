

export default function Home() {
  return (
    <div>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Product Information</title>
  <style dangerouslySetInnerHTML={{__html: "\n        * {\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n            font-family: Arial, sans-serif;\n        }\n\n        body {\n            display: flex;\n            flex-direction: column;\n            height: 100vh;\n        }\n\n        /* Navigation Bar */\n        .navbar {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            background-color: #333;\n            padding: 15px 20px;\n            color: white;\n        }\n\n        .nav-buttons {\n            display: flex;\n            gap: 15px;\n        }\n\n        .nav-buttons button {\n            background: #555;\n            border: none;\n            color: white;\n            padding: 10px 15px;\n            cursor: pointer;\n            font-size: 16px;\n            border-radius: 5px;\n        }\n\n        .nav-buttons button:hover {\n            background: #777;\n        }\n\n        .edit-button {\n            background: red;\n            padding: 10px 15px;\n            font-weight: bold;\n        }\n\n        .edit-button:hover {\n            background: darkred;\n        }\n\n        /* Main Layout */\n        .container {\n            display: flex;\n            flex: 1;\n        }\n\n        .sidebar {\n            width: 250px;\n            background-color: #f4f4f4;\n            padding: 20px;\n            border-right: 2px solid #ddd;\n        }\n\n        .sidebar h3 {\n            margin-bottom: 10px;\n        }\n\n        .sidebar p {\n            margin-bottom: 15px;\n            font-size: 16px;\n        }\n\n        .main-content {\n            flex-grow: 1;\n            padding: 40px;\n        }\n\n        .product-name {\n            font-size: 28px;\n            font-weight: bold;\n            margin-bottom: 15px;\n        }\n\n        /* Pretty bordered text boxes */\n        .product-description {\n            font-size: 18px;\n            line-height: 1.5;\n            padding: 15px;\n            margin-top: 10px;\n            position: relative;\n            border: 2px solid #ddd;\n            border-radius: 8px;\n            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);\n            background-color: #fff;\n            transition: all 0.3s ease-in-out;\n            cursor: grab;\n        }\n\n        /* When dragging */\n        .product-description:active {\n            cursor: grabbing;\n        }\n\n        /* Border changes when editing */\n        .editable[contenteditable=\"true\"] {\n            border: 2px dashed #007bff;\n            box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);\n            background-color: #f9f9ff;\n        }\n\n        .hidden {\n            display: none;\n        }\n\n        .action-buttons {\n            margin-top: 10px;\n        }\n\n        .action-buttons button {\n            background: green;\n            border: none;\n            color: white;\n            padding: 8px 12px;\n            cursor: pointer;\n            font-size: 14px;\n            border-radius: 5px;\n            margin-right: 5px;\n        }\n\n        /* Remove button */\n        .remove-btn {\n            background: darkred;\n            border: none;\n            color: white;\n            padding: 5px 10px;\n            cursor: pointer;\n            font-size: 12px;\n            border-radius: 3px;\n            position: absolute;\n            top: 5px;\n            right: 5px;\n        }\n\n        .remove-btn:hover {\n            background: red;\n        }\n    " }} />
  {/* Navigation Bar */}
  <div className="navbar">
    <div className="nav-buttons">
      <button>Home</button>
      <button>Catalog</button>
      <button>Points</button>
      <button>More</button>
    </div>
    <button className="edit-button" id="edit-btn">Edit</button>
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
        <div className="product-description editable" contentEditable="false" draggable="true">
          This is the product description. It provides an overview of the product’s features, benefits, and key details.
          <button className="remove-btn hidden">X</button>
        </div>
      </div>
      <div className="action-buttons hidden" id="edit-controls">
        <button>Add Text Box</button>
        <button>Save</button>
      </div>
    </div>
  </div>
</div>
    );
}
