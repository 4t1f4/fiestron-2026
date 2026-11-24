import { useRef } from "react";
import { Link } from "react-router-dom";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import type { MotionValue } from "framer-motion";
import type { CSSProperties } from "react";

import { ArrowUpRight } from "lucide-react";

import { EVENTS } from "./eventsData";
import type { FestEvent } from "./eventsData";

import "./events.css";

const EASE = [0.22, 1, 0.36, 1] as const;

function getEventTypeBadge(category: string): string {
  const upper = category.trim().toUpperCase();

  return upper.endsWith("EVENT") ? upper : `${upper} EVENT`;
}

interface EventCardProps {
  event: FestEvent;
  index: number;
  total: number;
  stackProgress: MotionValue<number>;
}

function EventCard({
  event,
  index,
  total,
  stackProgress,
}: EventCardProps) {
  const start = index / total;

  const targetScale = Math.max(
    0.92,
    1 - (total - 1 - index) * 0.01
  );

  const scale = useTransform(
    stackProgress,
    [start, 1],
    [1, targetScale]
  );

  const y = useTransform(
    stackProgress,
    [start, 1],
    [0, -8]
  );

  const wrapperStyle = {
    "--i": Math.min(index, 7),
    zIndex: index + 1,
  } as CSSProperties;

  return (
    <div
      className="events-card-wrapper"
      style={wrapperStyle}
    >
      <motion.article
        className="events-card"
        style={{ scale, y }}
      >

        {/* Header */}
        <div className="events-card-head">

          <span
            className="events-card-index select-none"
            aria-hidden="true"
          >
            {event.number}
          </span>

          <div className="events-card-meta">

            <span className="events-pill-badge">
              {getEventTypeBadge(event.category)}
            </span>

            <h3 className="events-card-title">
              {event.name}
            </h3>

            <p className="events-card-format">
              {event.format}
            </p>

          </div>

          {/* Navigate to individual event page */}
          <Link
            to={`/events/${event.id}`}
            className="events-details-btn"
          >
            <span>DETAILS</span>
            <ArrowUpRight size={14} />
          </Link>

        </div>

        {/* Bento Images */}
        <div className="events-bento">

          <div className="events-bento-stack">

            <div className="events-bento-box">
              <img
                src={event.images[0]}
                alt={`${event.name} moment 1`}
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="events-bento-box">
              <img
                src={event.images[1]}
                alt={`${event.name} moment 2`}
                loading="lazy"
                decoding="async"
              />
            </div>

          </div>

          <div className="events-bento-box">
            <img
              src={event.images[2]}
              alt={`${event.name} spotlight`}
              loading="lazy"
              decoding="async"
            />
          </div>

        </div>

      </motion.article>
    </div>
  );
}

export default function Events() {
  const stackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  const eventCount = String(EVENTS.length).padStart(2, "0");

  return (
    <section
      id="events"
      className="events-section relative isolate overflow-x-clip bg-transparent text-white"
    >
      <div className="events-container">

        {/* Section Heading */}
        <motion.header
          className="events-head"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: EASE }}
        >

          <p className="events-eyebrow">
            <span
              className="events-eyebrow-line"
              aria-hidden="true"
            />

            The Line-up

            <span
              className="events-eyebrow-line"
              aria-hidden="true"
            />
          </p>

          <h2 className="events-hero-title">
            PICK YOUR <span>LOOP</span>
          </h2>

          <p className="events-head-copy">
            Every event across the fest, stacked in one place.
            Scroll through the cards, then open any one for
            details and registration.
          </p>

          <div
            className="events-head-foot"
            aria-hidden="true"
          >
            <span className="events-head-rule" />

            <span className="events-head-count">
              {eventCount} EVENTS
            </span>

            <span className="events-head-rule" />
          </div>

        </motion.header>

        {/* Event Cards */}
        <div
          ref={stackRef}
          className="events-stack"
        >
          {EVENTS.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              total={EVENTS.length}
              stackProgress={scrollYProgress}
            />
          ))}
        </div>

      </div>
    </section>
  );
}