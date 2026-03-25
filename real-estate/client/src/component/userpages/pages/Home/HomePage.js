import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import HomeHero from "../../components/Home/HomeHero/HomeHero";
import HomeVision from "../../components/Home/HomeVision/HomeVision";
import HomeServices from "../../components/Home/HomeServices/HomeServices";
import HomeWhyChoose from "../../components/Home/HomeWhyChoose/HomeWhyChoose";
import HomeStats from "../../components/Home/HomeStats/HomeStats";
import HomeTestimonials from "../../components/Home/HomeTestimonials/HomeTestimonials";
import HomePartners from "../../components/Home/HomePartners/HomePartners";
import HomeCTA from "../../components/Home/HomeCTA/HomeCTA";
import "./HomePage.css";

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="home-page">
      <HomeHero />
      <HomeVision />
      <HomeServices />
      <HomeWhyChoose />
      <HomeStats />
      <HomeTestimonials />
      <HomePartners />
      <HomeCTA />
    </div>
  );
};

export default HomePage;
