<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Status</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n        body {\n            font-family: 'Times New Roman', Times, serif;\n            display: flex;\n            flex-direction: column;\n            justify-content: center;\n            align-items: center;\n            height: 100vh;\n            background-color: white;\n            margin: 0;\n            text-align: center;\n        }\n        #status {\n            font-size: 24px;\n            font-weight: bold;\n            margin: 20px 0;\n        }\n        .accepted { color: green; }\n        .denied { color: red; }\n        .pending { color: orange; }\n        button {\n            margin-top: 20px;\n            padding: 10px 20px;\n            background-color: #007bff;\n            color: white;\n            border: none;\n            border-radius: 5px;\n            cursor: pointer;\n        }\n        button:hover {\n            background-color: #0056b3;\n        }\n    "
    }}
  />
  <h1>Application Status</h1>
  <p id="status" className="pending">
    Checking status...
  </p>
  <button id="homeBtn">Return to Home</button>
</>
