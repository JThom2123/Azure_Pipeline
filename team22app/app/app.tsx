import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage"; // Import Homepage component
import ProductInfo from "./ProductInfo"; // Import ProductInfo component
import AboutPage from "./AboutPage"; // Import AboutPage component
import DriverApp from "./DriverApp"; // Import DriverApp component
import SponsorApp from "./SponsorApp"; // Import SponsorApp component

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default Route (Homepage) */}
        <Route path="/" element={<Homepage />} /> {/* Homepage route */}

        {/* Other Routes */}
        <Route path="/product-info" element={<ProductInfo />} />
        <Route path="/page" element={<AboutPage />} />
        <Route path="/driver_app" element={<DriverApp />} />
        <Route path="/sponsor_app" element={<SponsorApp />} />
      </Routes>
    </Router>
  );
};

export default App;