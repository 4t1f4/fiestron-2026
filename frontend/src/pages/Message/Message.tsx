import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ArrowUpRight,
  MessageCircle,
  Send,
} from "lucide-react";

import "./message.css";

const CONTACT_EMAIL = "kccs.techclub@gmail.com";

const SUBJECT_OPTIONS = [
  "Event inquiry",
  "Sponsorship",
  "Other",
];

export default function Message() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Prepare the message and open the visitor's email application.
    const body = `Name: ${formData.name}
Email: ${formData.email}

${formData.message}`;

    const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  }

  return (
    <main className="message-page">

      {/* A simple way to return to the FAQ section */}
      <Link to="/home#faq" className="message-back-link">
        <ArrowLeft size={16} />
        <span>Back to FAQs</span>
      </Link>

      <div className="message-page-container">

        {/* Small heading above the form */}
        <div className="message-intro">
          <span className="message-eyebrow">
            <span />
            LET'S CONNECT
            <span />
          </span>

          <h1>
            Your message.
            <br />
            <span>Our next move.</span>
          </h1>

          <p>
            Have a question, an idea, or something exciting to discuss?
            We'd love to hear from you. Drop us a message and our team
            will get back to you.
          </p>
        </div>

        {/* Main glassmorphism form card */}
        <div className="message-card">

          <div className="message-card-header">
            <div className="message-card-icon">
              <MessageCircle size={21} />
            </div>

            <div>
              <h2>Send us a message</h2>
              <p>Fill in the details and tell us what's on your mind.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="message-form">

            {/* Name and email */}
            <div className="message-form-row">

              <div className="message-field">
                <label htmlFor="message-name">
                  Your name
                </label>

                <input
                  id="message-name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="message-field">
                <label htmlFor="message-email">
                  Email address
                </label>

                <input
                  id="message-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* Visitors can type their own subject or pick a suggestion */}
            <div className="message-field">
              <label htmlFor="message-subject">
                Subject
              </label>

              <input
                id="message-subject"
                name="subject"
                type="text"
                placeholder="What is this about?"
                value={formData.subject}
                onChange={handleChange}
                required
              />

              <div className="message-chips">
                {SUBJECT_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option}
                    className={`message-chip ${
                      formData.subject === option ? "is-active" : ""
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        subject: option,
                      }))
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Actual message */}
            <div className="message-field">
              <label htmlFor="message-content">
                Your message
              </label>

              <textarea
                id="message-content"
                name="message"
                rows={5}
                placeholder="Tell us what's on your mind..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit the form */}
            <button type="submit" className="message-submit">
              <span>Send message</span>
              <Send size={16} />
            </button>

          </form>

          <div className="message-card-footer">
            <span>Prefer email?</span>

            <a href={`mailto:${CONTACT_EMAIL}`}>
              Contact us directly
              <ArrowUpRight size={14} />
            </a>
          </div>

        </div>

        <p className="message-bottom-note">
          FIESTRON 2026 <span>•</span> K.C. COLLEGE, MUMBAI
        </p>

      </div>
    </main>
  );
}