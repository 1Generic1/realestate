import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AgentsHero from "../../components/Agents/AgentsHero/AgentsHero";
import AgentStats from "../../components/Agents/AgentStats/AgentStats";
import AgentGrid from "../../components/Agents/AgentGrid/AgentGrid";
import AgentTestimonials from "../../components/Agents/AgentTestimonials/AgentTestimonials";
import JoinTeam from "../../components/Agents/JoinTeam/JoinTeam";
import "./AgentsPage.css";

const AgentsPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="agents-page">
      <AgentsHero />
      <AgentStats />
      <AgentGrid />
      <AgentTestimonials />
      <JoinTeam />
    </div>
  );
};

export default AgentsPage;
