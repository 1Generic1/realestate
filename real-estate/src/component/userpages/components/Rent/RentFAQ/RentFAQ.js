import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./RentFAQ.css";

const RentFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What's the minimum rental period?",
      answer:
        "Most properties require a minimum rental period of 1 year. However, some landlords may consider 6 months depending on the property.",
    },
    {
      question: "Are utilities included in the rent?",
      answer:
        "Generally, utilities like electricity and water are not included in the rent. However, some premium properties may include certain utilities.",
    },
    {
      question: "What documents do I need to rent?",
      answer:
        "Typically you'll need: Valid ID, proof of income/employment, bank statements, and guarantor information if required.",
    },
    {
      question: "Is a security deposit required?",
      answer:
        "Yes, a security deposit equivalent to 1-2 years' rent is usually required, refundable at the end of your tenancy.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="rent-faq">
      <div className="rent-container">
        {/* Header */}
        <div className="rent-section-header" data-aos="fade-up">
          <span className="rent-section-tag">Got Questions?</span>
          <h2 className="rent-section-title">Frequently Asked Questions</h2>
          <p className="rent-section-text">
            Find answers to common questions about renting
          </p>
        </div>

        {/* FAQ List */}
        <div className="rent-faq-list" data-aos="fade-up" data-aos-delay="100">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rent-faq-item ${openIndex === index ? "rent-faq-open" : ""}`}
            >
              <button
                className="rent-faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              <div className="rent-faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RentFAQ;
