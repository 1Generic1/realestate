import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
//import Header from "./component/userpages/Header";
import Header from "./component/userpages/components/Header/Header";
import Footer from "./component/userpages/components/Footer/FooterPage";
import HomePage from "./component/userpages/pages/Home/HomePage";
import BuyPage from "./component/userpages/pages/Buy/BuyPage";
import RentPage from "./component/userpages/pages/Rent/RentPage";
import LandPage from "./component/userpages/pages/Land/LandPage";
import AboutPage from "./component/userpages/pages/About/AboutPage";
import ContactPage from "./component/userpages/pages/Contact/ContactPage";
import AgentsPage from "./component/userpages/pages/Agents/AgentsPage";
import ServicesPage from "./component/userpages/ServicesPage";
import ConsultationPage from "./component/userpages/ConsultationPage";

import { CompanyProvider } from "./context/CompanyContext";

function App() {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once
      offset: 100, // Offset from viewport
      delay: 0, // Default delay
      easing: "ease-in-out", // Easing function
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <CompanyProvider>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/buy" element={<BuyPage />} />
            <Route path="/rent" element={<RentPage />} />
            <Route path="/land" element={<LandPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/consultation" element={<ConsultationPage />} />
            <Route path="/vision" element={<div>Vision & Mission Page</div>} />
            <Route path="/privacy" element={<div>Privacy Policy</div>} />
            <Route path="/terms" element={<div>Terms of Service</div>} />
          </Routes>
          <Footer />
        </CompanyProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
