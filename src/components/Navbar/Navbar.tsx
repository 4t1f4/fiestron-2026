import { useEffect, useState } from "react";
import "./navbar.css";

const navItems = [
  { label: "ABOUT", href: "#about", id: "about" },
  { label: "COUNCIL", href: "/council", id: "council" },
  { label: "TIMELINE", href: "#timeline", id: "timeline" },
  { label: "EVENTS", href: "#events", id: "events" },
  { label: "SPONSORS", href: "#sponsors", id: "sponsors" },
  { label: "CONTACT", href: "#contact", id: "contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);

  const currentPath = window.location.pathname;

  // Keep track of the section currently visible on the homepage
  useEffect(() => {
    if (currentPath !== "/") return;

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

  function handleNavigation(id: string) {
    setMenuOpen(false);
    setActiveSection(id);
  }

  return (
    <header className="navbar">
      {/* Fiestron logo also takes users back to the homepage */}
      <a
        href="/#home"
        className="navbar-logo"
        onClick={() => handleNavigation("about")}
      >
        FIESTRON<span>2026</span>
      </a>

      {/* Toggle the navigation menu on smaller screens */}
      <button
        className={`navbar-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Main navigation links */}
      <nav className={`navbar-links ${menuOpen ? "show" : ""}`}>
        {navItems.map((item) => {
          const isActive =
            item.id === "council"
              ? currentPath === "/council"
              : currentPath === "/" && activeSection === item.id;

          const href =
            item.href.startsWith("#") && currentPath !== "/"
              ? `/${item.href}`
              : item.href;

          return (
            <a
              key={item.id}
              href={href}
              className={`navbar-link ${isActive ? "active" : ""}`}
              onClick={() => handleNavigation(item.id)}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}