<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Product Information</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n        .admin, .sponsor, .driver {\n            display: none;\n        }\n        \n        * {\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n            font-family: Arial, sans-serif;\n        }\n\n        body {\n            display: flex;\n            flex-direction: column;\n            height: 100vh;\n        }\n\n        .navbar {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            background-color: #333;\n            padding: 15px 20px;\n            color: white;\n        }\n\n        .nav-buttons {\n            display: flex;\n            gap: 15px;\n        }\n\n        .nav-buttons button {\n            background: #555;\n            border: none;\n            color: white;\n            padding: 10px 15px;\n            cursor: pointer;\n            font-size: 16px;\n            border-radius: 5px;\n        }\n\n        .nav-buttons button:hover {\n            background: #777;\n        }\n\n        .container {\n            display: flex;\n            flex: 1;\n        }\n\n        .sidebar {\n            width: 250px;\n            background-color: #f4f4f4;\n            padding: 20px;\n            border-right: 2px solid #ddd;\n        }\n\n        .main-content {\n            flex-grow: 1;\n            padding: 40px;\n        }\n\n        .welcome-card {\n            font-size: 54px;\n            font-weight: normal;\n            margin-bottom: 15px;\n        }\n        \n        .user-info {\n            width: 100%;\n            padding: 15px;\n            display: flex;\n            flex-wrap: wrap;\n        }\n\n        .item {\n            margin-right: 74px;\n        }\n\n        @media (max-width: 975px) {\n            .item {\n                margin-right: 0%;\n            }\n            .container span {\n                width: 100%;\n                text-align: left;\n                margin-bottom: 10px;\n            }\n        }\n\n        .hidden {\n            display: none;\n        }\n    "
    }}
  />
  <div className="navbar">
    <div className="nav-buttons">
      <button>Home</button>
      <button>Catalog</button>
      <button>Points</button>
      <button onclick="window.location.href='aboutpage.html'">About</button>
      <button onclick="redirectToApp()">Application</button>
      <button>More</button>
    </div>
  </div>
  <div className="container">
    <div className="sidebar" />
    <div className="main-content">
      <h1 className="welcome-card">Welcome, Username</h1>
      <div className="user-info driver">
        <span className="item">Account Type: Driver</span>
        <span className="item">Sponsor name: Walmart</span>
        <span className="item">Current Points: 24</span>
      </div>
      <div className="user-info sponsor">
        <span className="item">Account Type: Sponsor</span>
        <span className="item">Sponsored Drivers List: ...</span>
      </div>
      <div className="user-info admin">
        <span className="item">Account Type: Admin</span>
        <span className="item">
          You are the best programmer in the world! Keep up the great work!!
        </span>
      </div>
    </div>
  </div>
</>
