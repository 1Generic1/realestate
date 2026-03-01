import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import LandHero from "../../components/Land/LandHero/LandHero";
import LandCategories from "../../components/Land/LandCategories/LandCategories";
import FeaturedLand from "../../components/Land/FeaturedLand/FeaturedLand";
import InvestBenefits from "../../components/Land/InvestBenefits/InvestBenefits";
import LandGuide from "../../components/Land/LandGuide/LandGuide";
import LandNewsletterModal from "../../components/Land/LandNewsletterModal/LandNewsletterModal";
import LandEnquiryForm from "../../components/Land/LandEnquiryForm/LandEnquiryForm";
import LandCTA from "../../components/Land/LandCTA/LandCTA";
import "./LandPage.css";

const LandPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-in-out",
    });

    // Check if user has already subscribed
    const subscribed = localStorage.getItem("landGuideSubscribed");
    if (subscribed) {
      setHasSubscribed(true);
    }

    // Show modal after 30 seconds if not subscribed
    const timer = setTimeout(() => {
      if (!hasSubscribed && !localStorage.getItem("landGuideSubscribed")) {
        setShowModal(true);
      }
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [hasSubscribed]);

  const handleSubscribe = (email) => {
    // Here you would send to your API
    console.log("Email subscribed:", email);

    // Store in localStorage
    localStorage.setItem("landGuideSubscribed", "true");
    localStorage.setItem("subscriberEmail", email);
    setHasSubscribed(true);
    setShowModal(false);

    // Track conversion (you can integrate with Google Analytics here)
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "YOUR_CONVERSION_ID",
        event_category: "newsletter",
        event_label: "land_guide_download",
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Optionally set a cookie to not show again for 7 days
    localStorage.setItem("landModalDismissed", Date.now().toString());
  };

  return (
    <div className="land-page">
      <LandHero />
      <LandCategories />
      <FeaturedLand />
      <InvestBenefits />
      <LandGuide />
      <LandEnquiryForm />
      <LandCTA />

      <LandNewsletterModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
};

export default LandPage;
