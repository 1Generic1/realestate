import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AboutHero from "../../components/about/AboutHero/AboutHero";
import CompanyStory from "../../components/about/CompanyStory/CompanyStory";
import MissionVision from "../../components/about/MissionVision/MissionVision";
import CoreValues from "../../components/about/CoreValues/CoreValues";
import Achievements from "../../components/about/Achievements/Achievements";
import TeamSection from "../../components/about/TeamSection/TeamSection";
import AboutCTA from "../../components/about/AboutCTA/AboutCTA";
import "./AboutPage.css";

const AboutPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="about-page">
      <AboutHero />
      <CompanyStory />
      <MissionVision />
      <CoreValues />
      <Achievements />
      <TeamSection />
      <AboutCTA />
    </div>
  );
};

export default AboutPage;
