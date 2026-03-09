import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import RentHero from "../../components/Rent/RentHero/RentHero";
import RentCategories from "../../components/Rent/RentCategories/RentCategories";
import FeaturedRentals from "../../components/Rent/FeaturedRentals/FeaturedRentals";
import WhyRentWithUs from "../../components/Rent/WhyRentWithUs/WhyRentWithUs";
import RentalInquiryForm from "../../components/Rent/RentalInquiryForm/RentalInquiryForm";
import RentalProcess from "../../components/Rent/RentalProcess/RentalProcess";
import RentFAQ from "../../components/Rent/RentFAQ/RentFAQ";
import RentCTA from "../../components/Rent/RentCTA/RentCTA";
import "./RentPage.css";

const RentPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="rent-page">
      <RentHero />
      <RentCategories />
      <FeaturedRentals />
      <WhyRentWithUs />
      <RentalInquiryForm />
      <RentalProcess />
      <RentFAQ />
      <RentCTA />
    </div>
  );
};

export default RentPage;
