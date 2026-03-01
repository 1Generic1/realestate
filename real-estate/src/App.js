import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./component/userpages/Header";
import Footer from "./component/userpages/Footer/FooterPage";
import HomePage from "./component/userpages/HomePage";
import BuyPage from "./component/userpages/pages/Buy/BuyPage";
import LandPage from "./component/userpages/pages/Land/LandPage";
import AboutPage from "./component/userpages/AboutPage";
import ContactPage from "./component/userpages/pages/Contact/ContactPage";
import AgentsPage from "./component/userpages/pages/Agents/AgentsPage";
import ServicesPage from "./component/userpages/ServicesPage";
import ConsultationPage from "./component/userpages/ConsultationPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/buy" element={<BuyPage />} />
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
      </div>
    </BrowserRouter>
  );
}

export default App;
