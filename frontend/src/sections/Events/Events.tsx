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

import { EVENTS, REGISTRATION_URL } from "./eventsData";
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
  onOpen: (event: FestEvent) => void;
}

function EventCard({
  event,
  index,
  total,
  stackProgress,
  onOpen,
}: EventCardProps) {
  const start = index / total;
  const targetScale = Math.max(0.92, 1 - (total - 1 - index) * 0.01);

  const scale = useTransform(stackProgress, [start, 1], [1, targetScale]);
  const y = useTransform(stackProgress, [start, 1], [0, -8]);

  const stickyTop = 92 + Math.min(index, 7) * 8;

  return (
    <div
      className="events-card-wrapper sticky mb-7"
      style={{
        top: `${stickyTop}px`,
        zIndex: index + 1,
      }}
    >
      <motion.article
        className="events-card relative flex flex-col gap-6 sm:gap-8 rounded-[30px] p-6 sm:p-9 lg:p-10"
        style={{
          scale,
          y,
        }}
      >
        {/* Top Row: Large Outlined Number + Pill / Title / Format on Left, DETAILS ↗ on Top Right */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4 sm:gap-7">
            <span
              className="events-card-index shrink-0 select-none"
              aria-hidden="true"
            >
              {event.number}
            </span>

            <div className="min-w-0">
              <span className="events-pill-badge inline-block rounded-full px-3.5 py-1 uppercase">
                {getEventTypeBadge(event.category)}
              </span>

              <h3 className="events-card-title mt-2.5 uppercase text-white">
                {event.name}
              </h3>

              <p className="events-card-format mt-2 uppercase text-[#D9D4E2]">
                {event.format}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpen(event)}
            className="events-details-btn shrink-0 inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 sm:px-5 sm:py-2.5 uppercase text-white"
          >
            <span>DETAILS</span>
            <ArrowUpRight size={15} />
          </button>
        </div>

        {/* 3-Photo Bento Layout: 40% Left (2 stacked) / 60% Right (1 large spotlight) */}
        <div className="grid h-[210px] sm:h-[290px] lg:h-[340px] grid-cols-[2fr_3fr] gap-3 sm:gap-4">
          <div className="grid min-h-0 grid-rows-2 gap-3 sm:gap-4">
            <div className="events-bento-box min-h-0 overflow-hidden rounded-[18px]">
              <img
                src={event.images[0]}
                alt={`${event.name} moment 1`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            <div className="events-bento-box min-h-0 overflow-hidden rounded-[18px]">
              <img
                src={event.images[1]}
                alt={`${event.name} moment 2`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          <div className="events-bento-box h-full overflow-hidden rounded-[18px]">
            <img
              src={event.images[2]}
              alt={`${event.name} spotlight`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
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
  const isPlaceholderLink =
    registerHref === "#" || registerHref === "#register";

  return createPortal(
    <AnimatePresence>
      {event && (
        <motion.div
          className="events-modal-backdrop fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="events-modal relative max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-[26px] text-white"
            role="dialog"
            aria-modal="true"
            aria-labelledby="events-modal-heading"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close event details"
              className="events-modal-close absolute right-4 top-4 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full text-white"
            >
              <X size={18} />
            </button>

            <div className="relative h-52 sm:h-56 w-full overflow-hidden">
              <img
                src={event.images[2]}
                alt={event.name}
                className="h-full w-full object-cover"
              />
              <div className="events-modal-hero-scrim pointer-events-none absolute inset-0" />
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="events-pill-badge rounded-full px-3 py-0.5 uppercase">
                    {getEventTypeBadge(event.category)}
                  </span>
                  <span className="events-mono-meta uppercase text-[#D9B8FF]">
                    EVENT #{event.number} · {event.format}
                  </span>
                </div>
                <h2
                  id="events-modal-heading"
                  className="events-modal-title mt-2 uppercase text-white"
                >
                  {event.name}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-7">
              <p className="events-body-copy font-semibold text-[#D9B8FF]">
                {event.tagline}
              </p>
              <p className="events-body-copy mt-2 text-[#C5C1CF]">
                {event.description}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailTile
                  icon={<Ticket size={16} />}
                  label="ENTRY FEE"
                  value={
                    event.fee === null || event.fee === 0
                      ? "TBD"
                      : `₹${event.fee}`
                  }
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
                onClick={(e) => {
                  if (isPlaceholderLink) e.preventDefault();
                }}
                className={`events-modal-cta mt-6 flex items-center justify-between gap-3 rounded-2xl px-5 py-3.5 uppercase text-white no-underline ${
                  isPlaceholderLink ? "is-disabled" : ""
                }`}
              >
                <span className="events-mono-meta font-semibold">
                  {isPlaceholderLink
                    ? "REGISTRATION OPENING SOON"
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
    <div className="events-detail-tile flex min-w-0 items-center gap-3 rounded-2xl p-3.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#9147FF]/20 text-[#D9B8FF]">
        {icon}
      </div>
      <div className="min-w-0">
        <span className="events-mono-meta block uppercase text-[#8A8A99]">
          {label}
        </span>
        <p className="events-body-copy truncate font-medium text-white">
          {value}
        </p>
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
    <section
      id="events"
      className="events-section relative isolate overflow-x-clip bg-transparent py-24 sm:py-28 text-white"
    >
      <div className="mx-auto w-[min(1140px,92%)]">
        <motion.header
          className="mx-auto mb-14 sm:mb-16 max-w-3xl text-center"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="events-mono-meta mb-3 font-semibold tracking-[0.28em] uppercase text-[#D9B8FF]">
            — THE LINE-UP —
          </p>

          <h2 className="events-hero-title uppercase text-white">
            EVERY EVENT, <span>ONE RUNWAY</span>
          </h2>

          <p className="events-body-copy mx-auto mt-4 max-w-xl text-[#C5C1CF]">
            The full roster across all three days. Scroll to run the stack, and
            open any card for details and registration.
          </p>
        </motion.header>

        <div ref={stackRef} className="pb-14">
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