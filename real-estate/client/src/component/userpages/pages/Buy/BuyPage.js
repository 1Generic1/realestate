import React, { useEffect, useState, useRef } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [shouldScroll, setShouldScroll] = useState(false);

  // Create a ref for the property grid section
  const propertyGridRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-in-out",
    });
  }, []);

  // Scroll to property grid when shouldScroll is true
  useEffect(() => {
    if (shouldScroll && propertyGridRef.current) {
      const yOffset = -80; // Offset for header height
      const element = propertyGridRef.current;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
      setShouldScroll(false);
    }
  }, [shouldScroll]);

  const handleSearch = (term) => {
    console.log("BuyPage received search:", term);
    setSearchTerm(term);
    setShouldScroll(true); // Trigger scroll after search
  };

  const handlePropertyTypeFilter = (type) => {
    console.log("BuyPage received property type:", type);
    setPropertyType(type);
    setShouldScroll(true); // Trigger scroll after filter
  };

  const handlePriceFilter = (range) => {
    console.log("BuyPage received price range:", range);
    setPriceRange(range);
    setShouldScroll(true); // Trigger scroll after filter
  };

  return (
    <div className="buy-page">
      <BuyHero
        onSearch={handleSearch}
        onPropertyTypeFilter={handlePropertyTypeFilter}
        onPriceFilter={handlePriceFilter}
      />
      <SearchCategories />

      {/* Property Grid with ref */}
      <div ref={propertyGridRef}>
        <PropertyGrid
          searchTerm={searchTerm}
          propertyType={propertyType}
          priceRange={priceRange}
        />
      </div>

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
