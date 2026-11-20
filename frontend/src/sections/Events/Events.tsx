import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  Trophy,
  Users,
  X,
} from "lucide-react";

import TimelineBackground from "../Timeline/TimelineBackground";
import { EVENTS, REGISTRATION_URL } from "./eventsData";
import type { FestEvent } from "./eventsData";

import "./events.css";

const EASE = [0.22, 1, 0.36, 1] as const;

interface EventCardProps {
  event: FestEvent;
  index: number;
  total: number;
  stackProgress: MotionValue<number>;
  onOpen: (event: FestEvent) => void;
}

function EventCard({
  event,
  index,
  total,
  stackProgress,
  onOpen,
}: EventCardProps) {
  // Progressive compression as subsequent cards stack over this card;
  // reverses smoothly back to scale 1 and y 0 when scrolling back up.
  const start = index / total;
  const targetScale = Math.max(0.9, 1 - (total - 1 - index) * 0.012);

  const scale = useTransform(stackProgress, [start, 1], [1, targetScale]);
  const y = useTransform(stackProgress, [start, 1], [0, -10]);

  const stickyTop = 96 + Math.min(index, 7) * 7;

  return (
    <div
      className="events-card-wrapper"
      style={{
        top: `${stickyTop}px`,
        zIndex: index + 1,
      }}
    >
      <motion.article
        className="events-card"
        style={{
          scale,
          y,
        }}
      >
        <div className="events-card-top">
          <div className="events-card-identity">
            <span className="events-card-index" aria-hidden="true">
              {event.number}
            </span>

            <div className="events-card-title-group">
              <div className="events-card-meta-row">
                <span className="events-card-category">
                  {event.category}
                </span>
                <span className="events-card-format">
                  {event.format}
                </span>
              </div>

              <h3 className="events-card-title">{event.name}</h3>
            </div>
          </div>

          <button
            type="button"
            className="events-details-button"
            onClick={() => onOpen(event)}
          >
            <span>DETAILS</span>
            <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="events-card-brief">
          <p className="events-card-tagline">{event.tagline}</p>
          <p className="events-card-description">{event.description}</p>
        </div>

        <div className="events-card-bento">
          <div className="events-bento-left">
            <div className="events-bento-thumb">
              <img
                src={event.images[0]}
                alt={`${event.name} moment 1`}
                loading="lazy"
              />
            </div>

            <div className="events-bento-thumb">
              <img
                src={event.images[1]}
                alt={`${event.name} moment 2`}
                loading="lazy"
              />
            </div>
          </div>

          <div className="events-bento-right">
            <img
              src={event.images[2]}
              alt={`${event.name} spotlight`}
              loading="lazy"
            />
            <div className="events-bento-scrim" />
            <span className="events-bento-badge">
              {event.number} · {event.category}
            </span>
          </div>
        </div>

        <div className="events-card-foot">
          <span className="events-card-schedule">
            <CalendarDays size={13} />
            {event.date} · {event.duration}
          </span>

          <span className="events-card-slot">
            DECK {event.number}/{String(total).padStart(2, "0")}
          </span>
        </div>
      </motion.article>
    </div>
  );
}

interface EventModalProps {
  event: FestEvent | null;
  onClose: () => void;
}

function EventModal({ event, onClose }: EventModalProps) {
  useEffect(() => {
    if (!event) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [event, onClose]);

  const registerHref = event?.registerUrl || REGISTRATION_URL;
  const isExternal = registerHref.startsWith("http");
  const isPlaceholderLink = registerHref === "#" || registerHref === "#register";

  return createPortal(
    <AnimatePresence>
      {event && (
        <motion.div
          className="events-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="events-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="event-modal-title"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="events-modal-close"
              onClick={onClose}
              aria-label="Close event details"
            >
              <X size={18} />
            </button>

            <div className="events-modal-hero">
              <img src={event.images[2]} alt={event.name} />
              <div className="events-modal-hero-scrim" />
              <div className="events-modal-hero-text">
                <span>
                  EVENT {event.number} · {event.category}
                </span>
                <h2 id="event-modal-title">{event.name}</h2>
              </div>
            </div>

            <div className="events-modal-body">
              <p className="events-modal-format">{event.format}</p>
              <p className="events-modal-description">{event.description}</p>

              <div className="events-modal-grid">
                <DetailTile
                  icon={<Ticket size={16} />}
                  label="ENTRY FEE"
                  value={event.fee === null || event.fee === 0 ? "TBD" : `₹${event.fee}`}
                />

                <DetailTile
                  icon={<Trophy size={16} />}
                  label="PRIZE POOL"
                  value={event.prizePool}
                />

                <DetailTile
                  icon={<CalendarDays size={16} />}
                  label="DATE"
                  value={event.date}
                />

                <DetailTile
                  icon={<Clock size={16} />}
                  label="TIME & DURATION"
                  value={
                    event.time === "TBD"
                      ? `TBD · ${event.duration}`
                      : `${event.time} · ${event.duration}`
                  }
                />

                <DetailTile
                  icon={<MapPin size={16} />}
                  label="VENUE"
                  value={event.venue}
                />

                <DetailTile
                  icon={<Users size={16} />}
                  label="TEAM SIZE"
                  value={event.teamSize}
                />
              </div>

              <a
                href={registerHref}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                aria-disabled={isPlaceholderLink}
                className={`events-modal-cta ${
                  isPlaceholderLink ? "is-placeholder" : ""
                }`}
                onClick={(e) => {
                  if (isPlaceholderLink) e.preventDefault();
                }}
              >
                <span>
                  {isPlaceholderLink
                    ? "REGISTRATION LINK · TBD"
                    : "REGISTER FOR EVENT"}
                </span>
                <ArrowUpRight size={17} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function DetailTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="events-detail-tile">
      <div className="events-detail-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <p>{value}</p>
      </div>
    </div>
  );
}

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<FestEvent | null>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="events" className="events-section bg-transparent text-white">
      <TimelineBackground />

      <div className="events-container">
        <motion.header
          className="events-header"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <p className="events-eyebrow">— THE LINE-UP —</p>

          <h2 className="events-main-heading">
            EVERY EVENT, <span>ONE RUNWAY</span>
          </h2>

          <p className="events-subtitle">
            The full roster across all three days. Scroll to run the stack, and
            open any card for details and registration.
          </p>
        </motion.header>

        <div ref={stackRef} className="events-stack">
          {EVENTS.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              total={EVENTS.length}
              stackProgress={scrollYProgress}
              onOpen={setSelectedEvent}
            />
          ))}
        </div>
      </div>

      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </section>
  );
}