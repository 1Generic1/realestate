import React from "react";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import "./TeamSection.css";

const TeamSection = () => {
  const team = [
    {
      name: "Taye Adebayo",
      position: "Founder & CEO",
      experience: "20+ years",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Visionary leader with a passion for transforming the real estate landscape.",
    },
    {
      name: "Folake Williams",
      position: "Head of Operations",
      experience: "15+ years",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      bio: "Expert in streamlining operations and ensuring client satisfaction.",
    },
    {
      name: "Michael Okonkwo",
      position: "Legal & Compliance Director",
      experience: "12+ years",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
      bio: "Ensuring all transactions are legally sound and compliant.",
    },
    {
      name: "Sarah Chen",
      position: "Investment Advisor",
      experience: "10+ years",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      bio: "Specializes in maximizing ROI for property investors.",
    },
  ];

  return (
    <section className="about-team">
      <div className="about-container">
        <div className="about-section-header" data-aos="fade-up">
          <span className="about-section-tag">Leadership</span>
          <h2 className="about-section-title">Meet Our Expert Team</h2>
          <p className="about-section-text">
            Dedicated professionals committed to your success
          </p>
        </div>

        <div className="about-team-grid">
          {team.map((member, index) => (
            <div
              key={index}
              className="about-team-card"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="about-team-image">
                <img src={member.image} alt={member.name} />
                <div className="about-team-social">
                  <a href="#">
                    <FaFacebookF />
                  </a>
                  <a href="#">
                    <FaTwitter />
                  </a>
                  <a href="#">
                    <FaLinkedinIn />
                  </a>
                </div>
              </div>
              <h3>{member.name}</h3>
              <p className="about-team-position">{member.position}</p>
              <p className="about-team-experience">{member.experience}</p>
              <p className="about-team-bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
