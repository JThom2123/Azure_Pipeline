var MyClass = React.createClass({
  render: function() {
    return (
      <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Sponsor Application</title>
        <style dangerouslySetInnerHTML={{__html: "\n        body {\n            font-family: 'Times New Roman', Times, serif;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            height: 100vh;\n            background-color: white;\n            margin: 0;\n        }\n\n        form {\n            background: white;\n            padding: 20px;\n            border-radius: 10px;\n            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);\n            width: 60%;\n            max-width: 800px;\n            min-width: 400px;\n        }\n\n        label, input, select, button {\n            display: block;\n            width: 100%;\n            margin-bottom: 10px;\n        }\n\n        .button-container {\n            display: flex;\n            gap: 10px;\n            justify-content: center;\n        }\n\n        button[type=\"button\"], .return-home {\n            padding: 10px;\n            width: 200px;\n            height: 35px;\n            background-color: #ffbf00; /* Yellow */\n            color: rgb(14, 14, 14);\n            border: none;\n            border-radius: 5px;\n            cursor: pointer;\n        }\n\n        button[type=\"button\"]:hover, .return-home:hover {\n            background-color: #e6a800;\n        }\n\n        /* Style for the Submit button */\n        button[type=\"submit\"] {\n            padding: 10px;\n            background-color: #007bff; /* Blue */\n            color: white;\n            border: none;\n            border-radius: 5px;\n            cursor: pointer;\n        }\n\n        button[type=\"submit\"]:hover {\n            background-color: #0056b3;\n        }\n\n        /* Custom styling for the remove button */\n        .remove-btn {\n            padding: 10px;\n            background-color: #ff6666; /* Light Red */\n            color: white;\n            border: none;\n            border-radius: 5px;\n            cursor: pointer;\n        }\n\n        .remove-btn:hover {\n            background-color: #cc4d4d;\n        }\n\n        /* Custom divider styling */\n        hr {\n            margin: 15px 0;\n            border: 1px solid #ccc;\n        }\n    " }} />
        <form action="homepage.html" method="get" id="sponsorForm">
          <h2 style={{textAlign: 'center'}}>Sponsor Application</h2>
          <label htmlFor="Sponsor-name">Sponsor Name:</label>
          <input type="text" id="Sponsor-name" name="Sponsor-name" required />
          <h3 style={{textAlign: 'left'}}>Driver Information</h3>
          <div id="driversContainer">
            <div className="driver">
              <label htmlFor="Driver-first-name">Driver First Name:</label>
              <input type="text" id="Driver-first-name" name="Driver-first-name" required />
              <label htmlFor="Driver-last-name">Driver Last Name:</label>
              <input type="text" id="Driver-last-name" name="Driver-last-name" required />
            </div>
          </div>
          <div className="button-container">
            <button type="button" id="addDriverBtn" onclick="addDriver()">➕ Add Another Driver</button>
            <button type="button" id="removeDriverBtn" className="remove-btn" onclick="removeDriver()">❌ Remove Last Driver</button>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
});