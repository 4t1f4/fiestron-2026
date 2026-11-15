import {
  Mail,
  MapPin,
  ArrowUpRight,
  Phone,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./footer.css";

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="currentColor"
    >
      <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.3 18H5.8V9.5h2.5ZM7.05 8.35a1.45 1.45 0 1 1 0-2.9 1.45 1.45 0 0 1 0 2.9ZM18.2 18h-2.5v-4.1c0-.98-.02-2.23-1.36-2.23-1.37 0-1.58 1.07-1.58 2.16V18h-2.5V9.5h2.4v1.16h.04a2.63 2.63 0 0 1 2.36-1.3c2.52 0 2.99 1.66 2.99 3.82Z" />
    </svg>
  );
}

const MAP_URL =
  "https://www.google.com/maps?q=Kishinchand+Chellaram+College+Churchgate+Mumbai&output=embed";

export default function Footer() {
  const navigate = useNavigate();

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === "/home" || window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/home");
    }
  };

  return (
    <footer className="fiestron-footer">
      {/* Overhead spotlight & subtle cyber grid */}
      <div className="footer-overhead-spotlight" />
      <div className="footer-grid-overlay" />


      <div className="footer-container">
        {/* MAIN 3-COLUMN BALANCED GRID: Brand | Center Helpline | Venue Map */}
        <div className="footer-upper-grid">
          
          {/* LEFT: Brand Logo (Home Link), Tagline & Socials */}
          <div className="footer-brand-block">
            <Link
              to="/home"
              onClick={handleHomeClick}
              className="footer-logo-home-link"
              aria-label="Go to Fiestron Home"
            >
              <img
                src="/FiestronLogo.png"
                alt="Fiestron 2026"
                className="footer-logo-img"
              />
              <span className="footer-year-badge">'26</span>
            </Link>

            <p className="footer-tagline">
              The Past Isn't Forgotten, <span>It's Rebooted.</span>
            </p>
            <p className="footer-subtext">
              KC College's premier technical festival where code, design, and future immersion collide.
            </p>

            <div className="footer-pill-tags">
              <span>CODE · CREATE · CONQUER</span>
            </div>

            <div className="footer-social-row">
              <a
                href="https://www.instagram.com/kc.techclub/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.linkedin.com/company/fiestron/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a
                href="mailto:kccs.techclub@gmail.com"
                aria-label="Email"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          {/* CENTER: Fest Helpline (2 Coordinators) */}
          <div className="footer-helpline-box">
            <div className="footer-box-header">
              <span className="footer-col-label">FEST HELPLINE</span>
              <span className="footer-sub-label">LEADS</span>
            </div>

            <div className="footer-leads-list">
              <div className="footer-lead-card">
                <div className="lead-top">
                  <span className="lead-name">Humaira Shiakh</span>
                  <span className="lead-badge">CORE</span>
                </div>
                <a href="tel:+919876543210" className="lead-phone">
                  <Phone size={12} /> +91 98765 43210
                </a>
              </div>

              <div className="footer-lead-card">
                <div className="lead-top">
                  <span className="lead-name">Gurveen Arora</span>
                  <span className="lead-badge">CORE</span>
                </div>
                <a href="tel:+919123456789" className="lead-phone">
                  <Phone size={12} /> +91 91234 56789
                </a>
              </div>
            </div>

            <a href="mailto:kccs.techclub@gmail.com" className="footer-email-row">
              <Mail size={13} /> kccs.techclub@gmail.com
            </a>
          </div>

          {/* RIGHT: Location & Colorful Map */}
          <div className="footer-location-box">
            <div className="footer-box-header">
              <span className="footer-col-label">VENUE</span>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Kishinchand+Chellaram+College+Churchgate+Mumbai"
                target="_blank"
                rel="noreferrer"
                className="footer-map-external"
              >
                MAPS <ArrowUpRight size={12} />
              </a>
            </div>

            <div className="footer-colorful-map">
              <iframe
                src={MAP_URL}
                title="K.C. College Location Map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <p className="footer-venue-caption">
              <MapPin size={13} /> K.C. College, Churchgate, Mumbai
            </p>
          </div>

        </div>

        {/* GIANT FIESTRON DISPLAY WORDMARK (Logo Violet & White Gradient) */}
        <div className="footer-giant-wordmark" aria-hidden="true">
          FIESTRON
        </div>

        {/* COMPACT BOTTOM BAR */}
        <div className="footer-separator-line" />
        <div className="footer-bottom-bar">
          <p>© 2026 FIESTRON · KC TECH CLUB</p>
          <p className="footer-dev-credit">
            BUILT BY{" "}
            <a href="https://github.com/4t1f4" target="_blank" rel="noreferrer">
              ATIFA SAJIDA
            </a>{" "}
            &amp;{" "}
            <a href="https://github.com/ASTHA_GITHUB_USERNAME" target="_blank" rel="noreferrer">
              ASTHA
            </a>{" "}
            · WEB TEAM
          </p>
          <p>CHURCHGATE, MUMBAI</p>
        </div>
      </div>
    </footer>
  );
}