import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ContactHero from "../../components/Contact/ContactHero/ContactHero";
import ContactInfo from "../../components/Contact/ContactInfo/ContactInfo";
import ContactForm from "../../components/Contact/ContactForm/ContactForm";
import MapSection from "../../components/Contact/MapSection/MapSection";
import SocialLinks from "../../components/Contact/SocialLinks/SocialLinks";
import ContactFAQ from "../../components/Contact/ContactFAQ/ContactFAQ";
import "./ContactPage.css";

const ContactPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="contact-page">
      <ContactHero />
      <ContactInfo />
      <div className="container">
        <div className="form-map-wrapper">
          <ContactForm />
          <MapSection />
        </div>
      </div>
      <SocialLinks />
      <ContactFAQ />
    </div>
  );
};

export default ContactPage;
