import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import RegistrationModal from "../RegistrationModal/RegistrationModal";
import "../Navbar/navbar.css";

export default function EventDetailsNavbar() {
  const [registrationOpen, setRegistrationOpen] = useState(false);

  return (
    <>
      <style>{`
        /* Event Details Navbar - Mobile Override */
        @media (max-width: 900px) {
          .event-details-navbar .navbar-links {
            position: static;
            width: auto;
            flex-direction: row;
            align-items: center;
            gap: clamp(12px, 3vw, 24px);
            padding: 0;
            background: transparent;
            border: none;
            opacity: 1;
            visibility: visible;
            transform: none;
          }

          .event-details-navbar .navbar-links .navbar-link {
            padding: 10px 0;
            font-size: 0.7rem;
          }

          .event-details-navbar .navbar-links .navbar-link::after {
            bottom: 3px;
          }

          .event-details-navbar .navbar-links .navbar-register-btn {
            padding: 0.55rem 1rem;
            font-size: 0.65rem;
          }
        }
      `}</style>

      <header className="navbar event-details-navbar">

        {/* Logo */}
        <Link to="/home#home" className="navbar-logo">
          <img
            src="/FiestronLogo.png"
            alt="Fiestron 2026"
            className="navbar-logo-img"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="navbar-links">

          {/* Explore Events */}
          <Link
            to="/home#events"
            className="navbar-link"
          >
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={15} className="text-[#AF69FF]" />
              EXPLORE EVENTS
            </span>
          </Link>

          {/* Register */}
          <button
            type="button"
            className="navbar-register-btn"
            onClick={() => setRegistrationOpen(true)}
          >
            REGISTER
          </button>

        </nav>
      </header>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={registrationOpen}
        onClose={() => setRegistrationOpen(false)}
      />
    </>
  );
}