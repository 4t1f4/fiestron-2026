import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ComponentType, MouseEvent } from "react";

import {
  X,
  ArrowRight,
  Code2,
  Trophy,
  Gamepad2,
  Sparkles,
  Compass,
  Zap,
  Camera,
  Laptop,
  Gift,
  Music,
  Swords,
  Crown,
  Terminal,
  Palette,
  Cpu,
  Brain,
  Mic,
  Puzzle,
  Flame,
} from "lucide-react";

import {
  timelineEvents,
  type TimelineEvent,
  type EventCategory as TimelineEventCategory,
} from "../../sections/Timeline/timelineData";

import "./registrationModal.css";

type IconComponent = ComponentType<{ size?: number }>;

interface RegistrationEvent extends TimelineEvent {
  icon: IconComponent;
  entryFee: string;
}

interface EventCategoryGroup {
  category: TimelineEventCategory;
  label: string;
  events: RegistrationEvent[];
}

// Placeholder fee labels per event name (replace with exact fees anytime)
const eventFeePlaceholders: Record<string, string> = {
  // Add exact overrides like: "24-Hour Hackathon": "₹300 / TEAM",
};

const DEFAULT_FEE_PLACEHOLDER = "FEE TBA";

// Fallback icons per category
const categoryIcons: Record<TimelineEventCategory, IconComponent> = {
  Technical: Code2,
  "Non-Technical": Sparkles,
  Gaming: Gamepad2,
  Carnival: Trophy,
};

// Distinct icon mapping by event keyword/name
function getEventIcon(
  eventName: string,
  category: TimelineEventCategory
): IconComponent {
  const name = eventName.toLowerCase();

  if (name.includes("hackathon") || name.includes("build")) return Trophy;

  if (name.includes("treasure") || name.includes("hunt")) return Compass;

  if (
    name.includes("type") ||
    name.includes("sprint") ||
    name.includes("speed")
  )
    return Zap;

  if (
    name.includes("reel") ||
    name.includes("photo") ||
    name.includes("shoot")
  )
    return Camera;

  if (
    name.includes("seminar") ||
    name.includes("workshop") ||
    name.includes("talk")
  )
    return Laptop;

  if (
    name.includes("stall") ||
    name.includes("market") ||
    name.includes("expo")
  )
    return Sparkles;

  if (
    name.includes("lucky") ||
    name.includes("draw") ||
    name.includes("raffle")
  )
    return Gift;

  if (
    name.includes("dj") ||
    name.includes("music") ||
    name.includes("night")
  )
    return Music;

  if (
    name.includes("bgmi") ||
    name.includes("pubg") ||
    name.includes("valorant") ||
    name.includes("battle")
  )
    return Swords;

  if (
    name.includes("clash") ||
    name.includes("royale") ||
    name.includes("chess")
  )
    return Crown;

  if (
    name.includes("free fire") ||
    name.includes("gaming") ||
    name.includes("esport") ||
    name.includes("fifa")
  )
    return Gamepad2;

  if (
    name.includes("debug") ||
    name.includes("terminal") ||
    name.includes("linux")
  )
    return Terminal;

  if (
    name.includes("ui") ||
    name.includes("ux") ||
    name.includes("design") ||
    name.includes("art")
  )
    return Palette;

  if (
    name.includes("ai") ||
    name.includes("ml") ||
    name.includes("bot") ||
    name.includes("hardware")
  )
    return Cpu;

  if (name.includes("quiz") || name.includes("brain")) return Brain;

  if (
    name.includes("pitch") ||
    name.includes("debate") ||
    name.includes("mic")
  )
    return Mic;

  if (
    name.includes("escape") ||
    name.includes("puzzle") ||
    name.includes("logic")
  )
    return Puzzle;

  if (
    name.includes("code") ||
    name.includes("web") ||
    name.includes("dev")
  )
    return Code2;

  if (name.includes("carnival") || name.includes("fun")) return Flame;

  return categoryIcons[category];
}

// Category display order
const categoryOrder: TimelineEventCategory[] = [
  "Technical",
  "Non-Technical",
  "Gaming",
  "Carnival",
];

// Category labels
const categoryLabels: Record<TimelineEventCategory, string> = {
  Technical: "TECHNICAL EVENTS",
  "Non-Technical": "NON-TECHNICAL EVENTS",
  Gaming: "GAMING EVENTS",
  Carnival: "CARNIVAL EVENTS",
};

// Automatically get all events from the timeline data with individual icons & fee placeholders
const eventCategories: EventCategoryGroup[] = categoryOrder.map(
  (category) => ({
    category,
    label: categoryLabels[category],

    events: timelineEvents
      .filter((event) => event.category === category)
      .map((event) => ({
        ...event,
        icon: getEventIcon(event.name, category),
        entryFee: eventFeePlaceholders[event.name] ?? DEFAULT_FEE_PLACEHOLDER,
      })),
  })
);

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({
  isOpen,
  onClose,
}: RegistrationModalProps) {
  // Handle body scroll and Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    const prevOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle event registration clicks
  function handleEventClick(
    e: MouseEvent<HTMLAnchorElement>,
    event: RegistrationEvent
  ) {
    if (!event.registrationUrl) {
      e.preventDefault();

      alert(
        `Registration link for "${event.name}" will be added soon!`
      );
    }
  }

  return createPortal(
    <div
      className="reg-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reg-modal-heading"
      onClick={onClose}
    >
      <div
        className="reg-modal-shell"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP HEADER */}
        <header className="reg-modal-top">
          <div className="reg-modal-top-left">
            <div className="reg-brand-row">
              {/* FIESTRON LOGO + YEAR */}
              <span className="reg-brand-group">
                <img
                  src="/FiestronLogo.png"
                  alt="Fiestron logo"
                  className="reg-brand-logo"
                />

                <span className="reg-brand-name">'26</span>
              </span>

              <span className="reg-badge">
                REGISTRATION
              </span>
            </div>

            <h2
              id="reg-modal-heading"
              className="reg-main-title"
            >
              PICK YOUR <span>EVENT</span>
            </h2>

            <p className="reg-subtitle">
              Choose an event to open its registration form.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close registration modal"
            className="reg-close-btn"
          >
            <X size={18} />
          </button>
        </header>

        {/* SCROLLABLE EVENT CATEGORIES */}
        <div className="reg-modal-body">
          {eventCategories.map((category) => (
            <div
              key={category.category}
              className="reg-category-block"
            >
              {/* CATEGORY HEADING */}
              <div className="reg-category-head">
                <span className="reg-category-label">
                  <i aria-hidden="true" />
                  {category.label}
                </span>

                <span className="reg-category-count">
                  {category.events.length}{" "}
                  {category.events.length === 1
                    ? "EVENT"
                    : "EVENTS"}
                </span>
              </div>

              {/* EVENTS GRID */}
              <div className="reg-events-grid">
                {category.events.map((event) => {
                  const Icon = event.icon;

                  return (
                    <a
                      key={event.name}
                      href={event.registrationUrl || "#"}
                      target={
                        event.registrationUrl
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        event.registrationUrl
                          ? "noopener noreferrer"
                          : undefined
                      }
                      onClick={(e) =>
                        handleEventClick(e, event)
                      }
                      className="reg-event-card"
                    >
                      <div className="reg-event-left">
                        {/* EVENT ICON */}
                        <span
                          className="reg-event-icon"
                          aria-hidden="true"
                        >
                          <Icon size={18} />
                        </span>

                        {/* EVENT NAME + FEE PLACEHOLDER */}
                        <div className="reg-event-meta">
                          <strong>{event.name}</strong>
                          <span className="reg-event-fee">
                            {event.entryFee}
                          </span>
                        </div>
                      </div>

                      {/* ARROW */}
                      <span
                        className="reg-event-arrow"
                        aria-hidden="true"
                      >
                        <ArrowRight size={15} />
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM STATUS BAR */}
        <footer className="reg-modal-bottom">
          <span className="reg-bottom-brand">
            <img
              src="/FiestronLogo.png"
              alt=""
              aria-hidden="true"
              className="reg-bottom-logo"
            />

            <span>'26</span>
          </span>

          <span>K.C. COLLEGE, CHURCHGATE</span>
        </footer>
      </div>
    </div>,
    document.body
  );
}