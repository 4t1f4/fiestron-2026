import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import RegistrationModal from "../RegistrationModal/RegistrationModal";
import "./navbar.css";

const navItems = [
  { label: "ABOUT", href: "#about", id: "about" },
  { label: "COUNCIL", href: "/council", id: "council" },
  { label: "EVENTS", href: "#events", id: "events" },
  { label: "TIMELINE", href: "#timeline", id: "timeline" },
  { label: "SPONSORS", href: "#sponsors", id: "sponsors" },
  { label: "FAQ", href: "#faq", id: "faq" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    if (currentPath !== "/home") return;

    const sections = navItems
      .filter((item) => item.href.startsWith("#"))
      .map((item) => document.getElementById(item.id))
      .filter(
        (section): section is HTMLElement => section !== null
      );

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          );

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.2, 0.4, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [currentPath]);

  // Scroll to the requested section when navigating from another page.
  useEffect(() => {
    if (currentPath !== "/home" || !location.hash) return;

    const sectionId = location.hash.substring(1);

    requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
      });
    });
  }, [currentPath, location.hash]);

  function handleNavigation(id: string) {
    setMenuOpen(false);
    setActiveSection(id);
  }

  return (
    <>
      <header className="navbar">
        <Link
          to="/home#home"
          className="navbar-logo"
          onClick={() => {
            handleNavigation("about");

            if (currentPath === "/home") {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }
          }}
        >
          <img
            src="/FiestronLogo.png"
            alt="Fiestron 2026"
            className="navbar-logo-img"
          />
        </Link>

        <button
          type="button"
          className={`navbar-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-links ${menuOpen ? "show" : ""}`}>
          {navItems.map((item) => {
            const isActive =
              item.id === "council"
                ? currentPath === "/council"
                : currentPath === "/home" &&
                  activeSection === item.id;

            const destination = item.href.startsWith("#")
              ? currentPath === "/home"
                ? item.href
                : `/home${item.href}`
              : item.href;

            return (
              <Link
                key={item.id}
                to={destination}
                className={`navbar-link ${isActive ? "active" : ""}`}
                onClick={() => handleNavigation(item.id)}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Registration button */}
          <button
            type="button"
            className="navbar-register-btn"
            onClick={() => {
              setMenuOpen(false);
              setRegistrationOpen(true);
            }}
          >
            REGISTER
          </button>
        </nav>
      </header>

      {/* Registration modal */}
      <RegistrationModal
        isOpen={registrationOpen}
        onClose={() => setRegistrationOpen(false)}
      />
    </>
  );
}