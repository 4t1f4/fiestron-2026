import { useEffect, useState } from "react";
import "./navbar.css";

const navItems = [
  { label: "HOME", href: "#home", id: "home" },
  { label: "ABOUT", href: "#about", id: "about" },
  { label: "INCHARGES", href: "/incharges", id: "incharges" },
  { label: "TEAMS", href: "/teams", id: "teams" },
  { label: "EVENTS", href: "#events", id: "events" },
  { label: "SPONSORS", href: "#sponsors", id: "sponsors" },
  { label: "CONTACT", href: "#contact", id: "contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const currentPath = window.location.pathname;

  useEffect(() => {
    if (currentPath !== "/") return;

    const sections = navItems
      .filter((item) => item.href.startsWith("#"))
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
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

    if (id === "incharges" || id === "teams") {
      setActiveSection(id);
      return;
    }

    setActiveSection(id);
  }

  return (
    <header className="navbar">
      <a
        href="/#home"
        className="navbar-logo"
        onClick={() => handleNavigation("home")}
      >
        FIESTRON<span>2026</span>
      </a>

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

      <nav className={`navbar-links ${menuOpen ? "show" : ""}`}>
        {navItems.map((item) => {
          const isActive =
            activeSection === item.id ||
            (item.id === "incharges" &&
              currentPath === "/incharges") ||
            (item.id === "teams" &&
              currentPath === "/teams");

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