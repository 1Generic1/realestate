import React from "react";
import "./CompanyStory.css";

const CompanyStory = () => {
  return (
    <section className="story-section">
      <div className="container">
        <div className="story-wrapper">
          <div className="story-content">
            <span className="section-subtitle">Our Journey</span>
            <h2 className="section-title">The TAYE'S PROPERTY Story</h2>
            <div className="story-text">
              <p>
                Founded in 2011 by Taye Adebayo, our company began with a simple
                vision: to transform the Nigerian real estate landscape through
                integrity, expertise, and client-centered service.
              </p>
              <p>
                What started as a small consultancy has grown into one of the
                most trusted names in property and realty solutions. Over the
                past 15 years, we've helped hundreds of clients achieve their
                property dreams, from first-time homebuyers to large-scale
                commercial investors.
              </p>
              <p>
                Our growth is a testament to our commitment to excellence and
                the trust our clients place in us. Today, we stand as a beacon
                of professionalism in the industry, ready to serve the next
                generation of property owners and investors.
              </p>
            </div>
            <div className="story-signature">
              <img
                src="https://via.placeholder.com/150x50/1a1a2e/b8860b?text=Taye+Adebayo"
                alt="Signature"
              />
              <p>Taye Adebayo, Founder & CEO</p>
            </div>
          </div>
          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Company History"
            />
            <div className="story-year-badge">
              <span>Est.</span>
              <strong>2011</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyStory;
