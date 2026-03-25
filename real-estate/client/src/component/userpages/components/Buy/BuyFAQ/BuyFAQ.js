import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./BuyFAQ.css";

const BuyFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What are the steps to buy property in Nigeria?",
      answer:
        "The process includes: 1) Research and property search, 2) Site inspection, 3) Legal due diligence (search at land registry), 4) Agreement signing, 5) Payment, 6) Transfer of title, 7) Registration at lands bureau.",
    },
    {
      question: "How do I verify land documents?",
      answer:
        "We recommend conducting a search at the land registry, verifying the Certificate of Occupancy (C of O), checking for encumbrances, and engaging a lawyer to review all documents.",
    },
    {
      question: "What are the hidden costs when buying property?",
      answer:
        "Additional costs include: Legal fees (about 5-10%), agency commission, stamp duty, registration fees, survey costs, and possibly renovation expenses.",
    },
    {
      question: "Can foreigners buy property in Nigeria?",
      answer:
        "Yes, foreigners can buy property in Nigeria. However, there are some restrictions on land in certain areas. It's advisable to work with a legal expert familiar with property laws.",
    },
    {
      question: "How long does the buying process take?",
      answer:
        "The timeline varies but typically takes 2-3 months from offer to completion, depending on documentation, financing, and legal processes.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="buy-faq-section">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <span className="section-subtitle">Got Questions?</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-description">
            Everything you need to know about buying property
          </p>
        </div>

        <div className="faq-container" data-aos="fade-up">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "active" : ""}`}
            >
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                <span>{faq.question}</span>
                {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              <div
                className={`faq-answer ${openIndex === index ? "open" : ""}`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuyFAQ;
