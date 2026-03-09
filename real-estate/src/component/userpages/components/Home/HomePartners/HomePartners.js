import React from "react";
import "./HomePartners.css";

const HomePartners = () => {
  const partners = [1, 2, 3, 4, 5, 6];

  return (
    <section className="home-partners">
      <div className="home-container">
        <div className="home-partners-wrapper" data-aos="fade-up">
          <h3>Trusted by Industry Leaders</h3>
          <div className="home-partners-grid">
            {partners.map((partner, index) => (
              <div key={index} className="home-partner-item">
                <div className="home-partner-placeholder"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePartners;
