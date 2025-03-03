import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SponsorForm: React.FC = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([{ id: 1 }]);

  const addDriver = () => {
    setDrivers([...drivers, { id: drivers.length + 1 }]);
  };

  const removeDriver = () => {
    if (drivers.length > 1) {
      setDrivers(drivers.slice(0, -1));
    }
  };

  return (
    <div>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Sponsor Application</title>
      <style>{`
        body {
          font-family: 'Times New Roman', Times, serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: white;
          margin: 0;
        }
        form {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          width: 60%;
          max-width: 800px;
          min-width: 400px;
        }
        label, input, select, button {
          display: block;
          width: 100%;
          margin-bottom: 10px;
        }
        .button-container {
          display: flex;
          gap: 10px;
          justify-content: center;
        }
        .return-home, button[type="button"] {
          padding: 10px;
          width: 200px;
          height: 35px;
          background-color: #ffbf00;
          color: rgb(14, 14, 14);
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button[type="button"]:hover, .return-home:hover {
          background-color: #e6a800;
        }
        button[type="submit"] {
          padding: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button[type="submit"]:hover {
          background-color: #0056b3;
        }
        .remove-btn {
          padding: 10px;
          background-color: #ff6666;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .remove-btn:hover {
          background-color: #cc4d4d;
        }
        hr {
          margin: 15px 0;
          border: 1px solid #ccc;
        }
      `}</style>
      <form id="sponsorForm">
        <h2 style={{ textAlign: "center" }}>Sponsor Application</h2>
        <label htmlFor="Sponsor-name">Sponsor Name:</label>
        <input type="text" id="Sponsor-name" name="Sponsor-name" required />
        <h3 style={{ textAlign: "left" }}>Driver Information</h3>
        <div id="driversContainer">
          {drivers.map((driver) => (
            <div className="driver" key={driver.id}>
              <label htmlFor={`Driver-first-name-${driver.id}`}>Driver First Name:</label>
              <input type="text" id={`Driver-first-name-${driver.id}`} name="Driver-first-name" required />
              <label htmlFor={`Driver-last-name-${driver.id}`}>Driver Last Name:</label>
              <input type="text" id={`Driver-last-name-${driver.id}`} name="Driver-last-name" required />
            </div>
          ))}
        </div>
        <div className="button-container">
          <button type="button" onClick={addDriver}>➕ Add Another Driver</button>
          <button type="button" className="remove-btn" onClick={removeDriver}>❌ Remove Last Driver</button>
        </div>
        <button type="submit">Submit</button>
        <button type="button" className="return-home" onClick={() => navigate("/sponsor")}>
          Return to Sponsor Page
        </button>
      </form>
    </div>
  );
};

export default SponsorForm;
