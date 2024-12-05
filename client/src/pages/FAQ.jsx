import React, { useState } from 'react';
import '../styling/FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is True Hood?",
      answer: "True Hood is an online clothing brand offering high-quality, stylish apparel for everyone. We focus on providing the best shopping experience for our customers."
    },
    {
      question: "How can I place an order?",
      answer: "You can place an order by selecting the products you like, adding them to your cart, and proceeding to checkout. Follow these instructions to complete your purchase. Please understand that we are not accepting CODs for now."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept a variety of payment methods, including credit/debit cards, net banking, and UPI. All transactions are secure and encrypted via Razorpay. Unfortunately, for now, we are not accepting CASH ON DELIVERIES (COD)."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you will receive a tracking number via email by Shiprocket. You can check this email anytime to track your order."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 3-day return policy for unused and unworn items. Please visit our returns page for more details and instructions on how to return an item."
    }
  ];

  return (
    <div className="faq-container">
      <h1 className="faq-title">Frequently Asked Questions</h1>
      {faqs.map((faq, index) => (
        <div key={index} className="faq-item">
          <div className="faq-question" onClick={() => toggleFAQ(index)}>
            <h3>{faq.question}</h3>
            <span className="faq-icon">{activeIndex === index ? '-' : '+'}</span>
          </div>
          {activeIndex === index && <p className="faq-answer">{faq.answer}</p>}
        </div>
      ))}
    </div>
  );
};

export default FAQ;