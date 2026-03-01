import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import BuyHero from "../../components/Buy/BuyHero/BuyHero";
import SearchCategories from "../../components/Buy/SearchCategories/SearchCategories";
import PropertyGrid from "../../components/Buy/PropertyGrid/PropertyGrid";
import PropertyTypes from "../../components/Buy/PropertyTypes/PropertyTypes";
import WhyBuyWithUs from "../../components/Buy/WhyBuyWithUs/WhyBuyWithUs";
import VirtualTours from "../../components/Buy/VirtualTours/VirtualTours";
import BuyerGuide from "../../components/Buy/BuyerGuide/BuyerGuide";
import PropertyAlerts from "../../components/Buy/PropertyAlerts/PropertyAlerts";
import RecentlySold from "../../components/Buy/RecentlySold/RecentlySold";
import BuyFAQ from "../../components/Buy/BuyFAQ/BuyFAQ";
import BuyCTA from "../../components/Buy/BuyCTA/BuyCTA";
import "./BuyPage.css";

const BuyPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="buy-page">
      <BuyHero />
      <SearchCategories />
      <PropertyGrid />
      <PropertyTypes />
      <WhyBuyWithUs />
      <VirtualTours />

      {/* Combined Newsletter & Guide Section */}
      <section className="combined-newsletter-section">
        <div className="container">
          <div className="combined-wrapper">
            <BuyerGuide />
            <PropertyAlerts />
          </div>
        </div>
      </section>

      <RecentlySold />
      <BuyFAQ />
      <BuyCTA />
    </div>
  );
};

export default BuyPage;
