import { useState } from "react";
import { Plus, Minus, ArrowUpRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

import "./faq.css";

const faqItems = [
  {
    question: "What is Fiestron 2026?",
    answer:
      "Fiestron 2026 is the flagship tech and fest celebration at K.C. College, Churchgate, Mumbai, bringing together coding sprints, hackathons, gaming brackets, creative showcases, and interactive carnival events.",
  },
  {
    question: "Who can participate in Fiestron?",
    answer:
      "Students from colleges and schools can participate in individual and team events depending on each event's format and eligibility rules.",
  },
  {
    question: "How do I register for events?",
    answer:
      "Open any event in the line-up or timeline to check its schedule, team size, and registration link once registrations go live.",
  },
  {
    question: "What is the hackathon & event registration deadline?",
    answer:
      "Official registration deadlines and slot confirmations will be announced on our announcements and social channels before the fest dates.",
  },
  {
    question: "Are there any participation fees?",
    answer:
      "Entry fees vary by event and format—some events are free to enter while select competitions or tournaments may carry a nominal fee.",
  },
  {
    question: "What prizes can I win?",
    answer:
      "Winners and runners-up across featured tracks compete for prize pools, certificates, and fest recognition.",
  },
  {
    question: "Do I need to bring my own laptop for technical events?",
    answer:
      "Participants in coding, hackathon, and design tracks should bring a charged laptop along with necessary chargers and tools unless stated otherwise in the event rules.",
  },
  {
    question: "Can I participate in multiple events?",
    answer:
      "Yes, as long as the event schedules do not overlap and you can manage the timings across rounds.",
  },
  {
    question: "Who do I contact if something is unclear?",
    answer:
      "Reach out to Humaira (+91 XXXXX XXXXX) or Gurveen (+91 XXXXX XXXXX), email kccs.techclub@gmail.com, or follow @kc.techclub on Instagram and Fiestron on LinkedIn at K.C. College, Churchgate, Mumbai.",
  },
];

export default function Faq() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  function toggleFaq(index: number) {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  }

  return (
    <section
      id="faq"
      className="faq-section-wrapper relative w-full px-5 py-24 sm:px-10"
    >
      <div className="faq-container relative z-10 mx-auto w-full max-w-7xl">

        {/* A quick introduction to the FAQ section */}
        <header className="faq-header">
          <h2 className="faq-title">
            Got questions? <span>We've got answers.</span>
          </h2>

          <p className="faq-description">
            Everything you need to know about Fiestron 2026: who can join, how
            to register, what to bring, and who to ask when you're stuck.
          </p>
        </header>

        <div className="faq-layout">

          {/* Contact information stays beside the questions */}
          <aside className="faq-left-sticky">
            <p className="faq-side-eyebrow">
              <span aria-hidden="true" />
              Frequently Asked
              <span aria-hidden="true" />
            </p>

            <h3 className="faq-side-title">
              FREQUENTLY
              <br />
              ASKED
              <br />
              <span>QUESTIONS</span>
            </h3>


            {/* A separate contact option for questions and collaborations */}
            <div className="faq-contact-extra">
              <p>
                Still have a question? Interested in sponsorships,
                collaborations, or something else?
              </p>

              <Link to="/message" className="faq-contact-link">
                <MessageCircle size={16} aria-hidden="true" />
                <span>Drop us a message</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </aside>

          {/* Expandable FAQ questions */}
          <div className="faq-list">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;

              return (
                <div
                  key={item.question}
                  className={`faq-item ${isOpen ? "is-open" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="faq-question-btn"
                  >
                    <span className="faq-question-text">
                      {item.question}
                    </span>

                    <span className="faq-toggle-icon" aria-hidden="true">
                      {isOpen ? (
                        <Minus size={15} />
                      ) : (
                        <Plus size={15} />
                      )}
                    </span>
                  </button>

                  <div className="faq-answer">
                    <div className="faq-answer-inner">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}