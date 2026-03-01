import React from "react";
import AgentCard from "../AgentCard/AgentCard";
import "./AgentGrid.css";

const AgentGrid = () => {
  const agentsData = [
    {
      name: "Sarah Johnson",
      title: "Senior Luxury Property Specialist",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      specialties: ["Luxury Homes", "Waterfront Properties", "International"],
      deals: 150,
      experience: 12,
      rating: 4.9,
      phone: "+234 555 1234",
      email: "sarah.j@tayesproperty.com",
      social: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
        instagram: "#",
      },
    },
    {
      name: "Michael Chen",
      title: "Commercial Real Estate Expert",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      specialties: ["Commercial", "Industrial", "Investment Properties"],
      deals: 200,
      experience: 15,
      rating: 5.0,
      phone: "+234 555 1235",
      email: "michael.c@tayesproperty.com",
      social: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
        instagram: "#",
      },
    },
    {
      name: "Folake Williams",
      title: "Land Acquisition Specialist",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      specialties: ["Land Banking", "Development Sites", "Zoning"],
      deals: 120,
      experience: 10,
      rating: 4.8,
      phone: "+234 555 1236",
      email: "folake.w@tayesproperty.com",
      social: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
        instagram: "#",
      },
    },
    {
      name: "Ahmed Hassan",
      title: "Residential Sales Expert",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
      specialties: ["Residential", "First-time Buyers", "Family Homes"],
      deals: 180,
      experience: 8,
      rating: 4.9,
      phone: "+234 555 1237",
      email: "ahmed.h@tayesproperty.com",
      social: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
        instagram: "#",
      },
    },
    {
      name: "Chioma Okafor",
      title: "Luxury Condo Specialist",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
      specialties: ["Condos", "Penthouses", "Urban Properties"],
      deals: 95,
      experience: 6,
      rating: 4.7,
      phone: "+234 555 1238",
      email: "chioma.o@tayesproperty.com",
      social: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
        instagram: "#",
      },
    },
    {
      name: "Oluwaseun Adeyemi",
      title: "Investment Advisor",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      specialties: [
        "Real Estate Investment",
        "Portfolio Management",
        "ROI Analysis",
      ],
      deals: 110,
      experience: 9,
      rating: 4.8,
      phone: "+234 555 1239",
      email: "oluwaseun.a@tayesproperty.com",
      social: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
        instagram: "#",
      },
    },
  ];

  return (
    <section className="agent-grid-section">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-subtitle">Our Team</span>
          <h2 className="section-title">Meet Our Expert Agents</h2>
          <p className="section-description">
            Professional real estate agents dedicated to helping you achieve
            your property goals
          </p>
        </div>

        <div className="agent-grid">
          {agentsData.map((agent, index) => (
            <AgentCard key={index} agent={agent} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentGrid;
