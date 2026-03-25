import React from "react";
import "./ContactFAQ.css";

const ContactFAQ = () => {
  const faqData = [
    {
      question: "What areas do you serve?",
      answer:
        "We serve clients across Lagos and major cities in Nigeria, with a focus on prime real estate locations.",
    },
    {
      question: "How quickly can I get a response?",
      answer:
        "We typically respond to all inquiries within 24 hours during business days.",
    },
    {
      question: "Do you offer virtual consultations?",
      answer:
        "Yes, we offer both in-person and virtual consultations to accommodate your preferences.",
    },
    {
      question: "What documentation do I need?",
      answer:
        "Our team will guide you through all required documentation based on your specific needs.",
    },
  ];

  return (
    <section className="faq-section">
      <div className="container">
        <div className="faq-header" data-aos="fade-up">
          <span className="faq-subtitle">Quick Answers</span>
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-description">
            Find quick answers to common questions about our services
          </p>
        </div>

        <div className="faq-grid">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="faq-item"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactFAQ;
