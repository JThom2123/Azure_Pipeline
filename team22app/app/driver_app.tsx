<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Driver Application</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        '\n        body {\n            font-family: \'Times New Roman\', Times, serif;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            height: 100vh;\n            background-color: white;\n            margin: 0;\n        }\n        form {\n            background: white;\n            padding: 20px;\n            border-radius: 10px;\n            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);\n            width: 60%;\n            max-width: 800px;\n            min-width: 400px;\n        }\n        label, input, select, button {\n            display: block;\n            width: 100%;\n            margin-bottom: 10px;\n        }\n        /* Style for the Submit button */\n        button[type="submit"] {\n            padding: 10px;\n            background-color: #007bff; /* Blue */\n            color: white;\n            border: none;\n            border-radius: 5px;\n            cursor: pointer;\n        }\n        button[type="submit"]:hover {\n            background-color: #0056b3;\n        }\n    '
    }}
  />
  <form action="pending.html" method="get">
    <h2 style={{ textAlign: "center" }}>Driver Application</h2>
    <label htmlFor="first-name">First Name:</label>
    <input type="text" id="first-name" name="first-name" required="" />
    <label htmlFor="last-name">Last Name:</label>
    <input type="text" id="last-name" name="last-name" required="" />
    <label htmlFor="email">Email:</label>
    <input type="email" id="email" name="email" required="" />
    <label htmlFor="phone">Phone Number:</label>
    <input type="tel" id="phone" name="phone" required="" />
    <label htmlFor="sponsor">Select a Sponsor:</label>
    <select id="sponsorDropdown" name="sponsor">
      <option value="">--Please choose a sponsor--</option>
      <option value="Option 1">Option 1</option>
      <option value="Option 2">Option 2</option>
      <option value="Option 3">Option 3</option>
    </select>
    <button type="submit">Submit</button>
  </form>
</>
