import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// User Pages
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

// Admin Pages
import AdminLogin from "./component/adminpages/pages/Login";
import AdminDashboard from "./component/adminpages/pages/Dashboard";
import AdminTemplates from "./component/adminpages/pages/Templates";
import AdminUsers from "./component/adminpages/pages/Users";
import AdminReferenceLetters from "./component/adminpages/pages/ReferenceLetters";
import AdminInquiries from "./component/adminpages/pages/Inquiries";
import AdminTestimonials from "./component/adminpages/pages/AdminTestimonials";
import AdminCompany from "./component/adminpages/pages/AdminCompany";
import AdminProperties from "./component/adminpages/pages/AdminProperties";

import SignUp from "./component/userpages/pages/Auth/SignUp";
import Login from "./component/userpages/pages/Auth/Login";
import ForgotPassword from "./component/userpages/pages/Auth/ForgotPassword";
import ResetPassword from "./component/userpages/pages/Auth/ResetPassword";
import AdvancedVerifyEmail from "./component/userpages/pages/Auth/AdvancedVerifyEmail";

import { CompanyProvider } from "./context/CompanyContext";

// Component to conditionally show Header and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
};

// Protected route wrapper for admin
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      delay: 0,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <BrowserRouter>
      <CompanyProvider>
        <Layout>
          <Routes>
            {/* User Routes */}
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

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/templates"
              element={
                <AdminRoute>
                  <AdminTemplates />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/letters"
              element={
                <AdminRoute>
                  <AdminReferenceLetters />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/inquiries"
              element={
                <AdminRoute>
                  <AdminInquiries />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/testimonials"
              element={
                <AdminRoute>
                  <AdminTestimonials />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/company"
              element={
                <AdminRoute>
                  <AdminCompany />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/properties"
              element={
                <AdminRoute>
                  <AdminProperties />
                </AdminRoute>
              }
            />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<AdvancedVerifyEmail />} />        // NO token
            <Route path="/verify-email/:token" element={<AdvancedVerifyEmail />} /> // HAS token
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </CompanyProvider>
    </BrowserRouter>
  );
}

export default App;
