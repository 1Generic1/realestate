import React from "react";
import { FaUsers, FaUserTie } from "react-icons/fa";
import "./TeamSection.css";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Taye Adebayo",
      position: "Founder & CEO",
      experience: "20+ years in real estate",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Visionary leader with a passion for transforming the real estate landscape.",
    },
    {
      name: "Folake Williams",
      position: "Head of Operations",
      experience: "15+ years property management",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "Expert in streamlining operations and ensuring client satisfaction.",
    },
    {
      name: "Michael Okonkwo",
      position: "Legal & Compliance Director",
      experience: "12+ years real estate law",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
      bio: "Ensuring all transactions are legally sound and compliant.",
    },
    {
      name: "Sarah Chen",
      position: "Investment Advisor",
      experience: "10+ years investment strategy",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      bio: "Specializes in maximizing ROI for property investors.",
    },
  ];

  return (
    <section className="team-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Leadership</span>
          <h2 className="section-title">Meet Our Expert Team</h2>
          <p className="section-description">
            Dedicated professionals committed to your success
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <div className="team-image">
                <img src={member.image} alt={member.name} />
                <div className="team-social">
                  <a href="#">
                    <FaUsers />
                  </a>
                  <a href="#">
                    <FaUserTie />
                  </a>
                </div>
              </div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-position">{member.position}</p>
              <p className="team-experience">{member.experience}</p>
              <p className="team-bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
