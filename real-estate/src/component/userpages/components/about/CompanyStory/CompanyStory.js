import React from "react";
import "./CompanyStory.css";

const CompanyStory = () => {
  return (
    <section className="about-story">
      <div className="about-container">
        <div className="about-story-wrapper">
          <div className="about-story-content" data-aos="fade-right">
            <span className="about-section-tag">Our Journey</span>
            <h2 className="about-section-title">The TAYE'S PROPERTY Story</h2>
            <div className="about-story-text">
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
            <div className="about-story-signature">
              <p>Taye Adebayo, Founder & CEO</p>
            </div>
          </div>

          <div className="about-story-image" data-aos="fade-left">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Company History"
            />
            <div className="about-story-year">
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
