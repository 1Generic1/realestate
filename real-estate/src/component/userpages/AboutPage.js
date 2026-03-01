import React from "react";
import AboutHero from "../about/Hero/AboutHero";
import CompanyStory from "../about/Story/CompanyStory";
import MissionVision from "../about/MissionVision/MissionVision";
import CoreValues from "../about/Values/CoreValues";
import Achievements from "../about/Achievements/Achievements";
import TeamSection from "../about/Team/TeamSection";
import AboutCTA from "../about/CTA/AboutCTA";
import "./styles/AboutPage.css";

const AboutPage = () => {
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
