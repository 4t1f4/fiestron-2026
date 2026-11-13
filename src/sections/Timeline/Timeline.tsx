import { useEffect, useMemo, useRef, useState } from "react";

import {
  Code2,
  Gamepad2,
  Brain,
  Palette,
  Mic2,
  Lightbulb,
  Rocket,
  Table2,
  BriefcaseBusiness,
  Zap,
  Trophy,
  LockKeyhole,
  Clapperboard,
  Megaphone,
  Coins,
  Layers,
  Ticket,
  Target,
  Dumbbell,
  Wind,
  Puzzle,
  Paintbrush,
  Dice5,
  MessageCircle,
  Wallet,
  Trash2,
  CalendarDays,
  MapPin,
  // Clock3,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

import TimelineBackground from "./TimelineBackground";

import {
  timelineEvents,
  type EventCategory,
  type EventDate,
  type TimelineEvent,
} from "./timelineData";

const days: EventDate[] = [
  "16 DEC",
  "17 DEC",
  "BOTH DAYS",
];

const categories: ("All" | EventCategory)[] = [
  "All",
  "Technical",
  "Non-Technical",
  "Gaming",
  "Carnival",
];

const eventIcons: Record<string, LucideIcon> = {
  "Code Quest": Code2,
  BGMI: Gamepad2,
  Chess: Brain,
  Carrom: Target,
  "Box Cricket": Trophy,
  "Logo Lore": Lightbulb,
  "Geocities.AI": Code2,
  "Retro Rendered": Palette,
  "One Mic Stand": Mic2,
  "Brain Buster": Brain,

  Hackathon: Rocket,
  "Table Tennis": Table2,
  "Vintage Ventures": BriefcaseBusiness,
  "Syntax Sprint": Zap,
  "Design.exe": Paintbrush,
  "FIFA Tournament": Trophy,
  "Escape Protocol": LockKeyhole,
  "Meme Mania": MessageCircle,
  "Netflix Trivia": Clapperboard,
  "Ad-A-Bit": Megaphone,

  "Coin Drop Challenge": Coins,
  "Stack Attack": Layers,
  "Ticket Toss": Ticket,
  "Brick Balance": Dumbbell,
  "Elbow Flip": Target,
  "Blow the Ball": Wind,
  "Rubber Band Shot": Target,
  "Straw Suction": Wind,
  "Emoji Riddle": Puzzle,
  "Color Trick": Palette,
  "7 Up 7 Down": Dice5,
  "Confusing Words": MessageCircle,
  "Penny Stack": Wallet,
  "Paper Ball Basket": Trash2,
};

const categoryColors: Record<EventCategory, string> = {
  Technical: "border-[#FF2E93]/40 bg-[#FF2E93]/10 text-[#FF8BC2]",
  "Non-Technical": "border-[#9D4EDD]/40 bg-[#9D4EDD]/10 text-[#D6ADFF]",
  Gaming: "border-[#FF1744]/40 bg-[#FF1744]/10 text-[#FF8A9B]",
  Carnival: "border-[#D69BFF]/40 bg-[#D69BFF]/10 text-[#E5C5FF]",
};

const categoryDescriptions: Record<EventCategory, string> = {
  Technical: "TECHNICAL EVENT",
  "Non-Technical": "NON-TECHNICAL EVENT",
  Gaming: "GAMING EVENT",
  Carnival: "CARNIVAL EVENT",
};

export default function Timeline() {
  const [selectedDay, setSelectedDay] =
    useState<EventDate>("16 DEC");

  const [selectedCategory, setSelectedCategory] =
    useState<"All" | EventCategory>("All");

  const [passedEvents, setPassedEvents] =
    useState<Set<number>>(new Set());

  const [rocketReversed, setRocketReversed] =
    useState(false);

  const trackRef = useRef<HTMLDivElement>(null);

  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const previousProgress = useRef(0);

  const progress = useMotionValue(0);

  const reduceMotion = useReducedMotion();

  const smoothProgress = useSpring(progress, {
    stiffness: 90,
    damping: 24,
    mass: 0.7,
  });

  const rocketTop = useTransform(
    smoothProgress,
    [0, 1],
    ["0%", "100%"]
  );

  // FILTER EVENTS
  const filteredEvents = useMemo(() => {
    return timelineEvents.filter((event) => {
      const matchesDay =
        selectedDay === "BOTH DAYS" ||
        event.date === selectedDay ||
        event.date === "BOTH DAYS";

      const matchesCategory =
        selectedCategory === "All" ||
        event.category === selectedCategory;

      return matchesDay && matchesCategory;
    });
  }, [selectedDay, selectedCategory]);

  // RESET TIMELINE
  const resetTimeline = () => {
    previousProgress.current = 0;
    progress.set(0);
    setPassedEvents(new Set());
    setRocketReversed(false);
    markerRefs.current = [];
  };

  const handleDayChange = (day: EventDate) => {
    if (day === selectedDay) return;

    resetTimeline();
    setSelectedDay(day);
  };

  const handleCategoryChange = (
    category: "All" | EventCategory
  ) => {
    if (category === selectedCategory) return;

    resetTimeline();
    setSelectedCategory(category);
  };

  // SCROLL TRACKING
  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    let animationFrame = 0;

    const measureProgress = () => {
      animationFrame = 0;

      const rect = track.getBoundingClientRect();

      if (rect.height <= 0) return;

      const rawProgress =
        (window.innerHeight * 0.5 - rect.top) / rect.height;

      const nextProgress = Math.min(
        1,
        Math.max(0, rawProgress)
      );

      const difference =
        nextProgress - previousProgress.current;

      if (Math.abs(difference) > 0.001) {
        setRocketReversed(difference < 0);
      }

      previousProgress.current = nextProgress;

      progress.set(nextProgress);

      const rocketY = nextProgress * rect.height;

      const nextPassed = new Set<number>();

      markerRefs.current.forEach((marker, index) => {
        if (!marker) return;

        const markerY =
          marker.getBoundingClientRect().top -
          rect.top +
          marker.offsetHeight / 2;

        if (rocketY >= markerY) {
          nextPassed.add(index);
        }
      });

      setPassedEvents((previous) => {
        if (
          previous.size === nextPassed.size &&
          [...previous].every((index) =>
            nextPassed.has(index)
          )
        ) {
          return previous;
        }

        return nextPassed;
      });
    };

    const requestMeasure = () => {
      if (!animationFrame) {
        animationFrame = requestAnimationFrame(measureProgress);
      }
    };

    requestMeasure();

    window.addEventListener("scroll", requestMeasure, {
      passive: true,
    });

    window.addEventListener("resize", requestMeasure);

    const observer = new ResizeObserver(requestMeasure);

    observer.observe(track);

    return () => {
      window.removeEventListener("scroll", requestMeasure);
      window.removeEventListener("resize", requestMeasure);

      observer.disconnect();

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [progress, selectedDay, selectedCategory]);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 24,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: reduceMotion ? 0 : 0.45,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section
      id="timeline"
      className="relative isolate w-full overflow-hidden bg-[#080609] px-5 py-28 sm:px-8 lg:px-12 2xl:px-16"
    >
      <TimelineBackground />

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[#080609]/20" />

      <div className="relative z-10 mx-auto w-full max-w-[1100px]">

        {/* SECTION HEADING */}

        <header className="mb-16 text-center">

          <p className="mb-5 flex items-center justify-center gap-4 font-mono text-[10px] font-semibold tracking-[0.35em] text-[#FF2E93]">
            <span className="h-px w-9 bg-[#FF2E93]" />
            THE COUNTDOWN BEGINS
            <span className="h-px w-9 bg-[#FF2E93]" />
          </p>

          <h2 className="font-['Orbitron'] text-3xl font-black tracking-[0.08em] text-[#F5F0F5] sm:text-5xl lg:text-6xl">
            THE LOOP{" "}
            <span className="text-[#FF2E93] drop-shadow-[0_0_20px_rgba(255,46,147,0.35)]">
              UNFOLDS
            </span>
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#A99AA5]">
            Three timelines. Countless experiences.
            <br />
            Every moment becomes part of the Fiestron 2026 story.
          </p>

        </header>

        {/* DAY FILTERS */}

        <div className="mb-6 flex flex-wrap justify-center gap-3">

          {days.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => handleDayChange(day)}
              className={`min-w-32 rounded border px-6 py-3 font-['Orbitron'] text-[11px] tracking-widest transition-all duration-300 ${
                selectedDay === day
                  ? "border-[#FF2E93] bg-[#FF2E93]/15 text-white shadow-[0_0_22px_rgba(255,46,147,0.15)]"
                  : "border-[#FF2E93]/25 bg-[#180710]/70 text-[#A99AA5] hover:border-[#FF2E93]/70 hover:text-white"
              }`}
            >
              {day}
            </button>
          ))}

        </div>

        {/* CATEGORY FILTERS */}

        <div className="mb-14 flex flex-wrap justify-center gap-2">

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              className={`rounded-full border px-5 py-2.5 text-[11px] transition-all duration-300 ${
                selectedCategory === category
                  ? "border-[#9D4EDD]/70 bg-[#9D4EDD]/15 text-white"
                  : "border-white/10 bg-white/[0.025] text-[#A99AA5] hover:border-[#9D4EDD]/50 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}

        </div>

        {/* EVENT COUNT */}

        <div className="mb-16 flex items-center justify-center gap-3 font-mono text-[10px] tracking-[0.2em] text-[#A99AA5]">

          <span className="font-['Orbitron'] text-2xl font-bold text-[#FF2E93]">
            {String(filteredEvents.length).padStart(2, "0")}
          </span>

          EVENTS IN THIS TIMELINE

        </div>

        {/* TIMELINE TRACK */}

        <div
          ref={trackRef}
          className="relative"
        >

          {/* CENTRAL RAIL */}

          <div className="pointer-events-none absolute bottom-0 left-[15px] top-0 z-0 w-[2px] bg-white/[0.08] md:left-1/2 md:-translate-x-1/2">

            <motion.div
              className="absolute left-0 top-0 h-full w-full origin-top bg-gradient-to-b from-[#9D4EDD] via-[#FF2E93] to-[#FF2E93]/30 shadow-[0_0_15px_rgba(255,46,147,0.65)]"
              style={{
                scaleY: reduceMotion ? 1 : smoothProgress,
              }}
            />

          </div>

          {/* MOVING ROCKET */}

          <motion.div
            className="pointer-events-none absolute left-[15px] top-0 z-30 -translate-x-1/2 -translate-y-1/2 md:left-1/2"
            style={{
              top: rocketTop,
            }}
          >

            <div className="relative h-16 w-16 md:h-28 md:w-28">

              <motion.img
                src="/rocket.png"
                alt="Fiestron timeline rocket"
                animate={{
                  rotate: rocketReversed ? -90 : 90,
                }}
                transition={{
                  duration: 0.45,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_0_16px_rgba(255,46,147,0.75)]"
              />

            </div>

          </motion.div>

          {/* TIMELINE EVENTS */}

          {filteredEvents.length > 0 ? (

            <AnimatePresence mode="wait">

              <motion.div
                key={`${selectedDay}-${selectedCategory}`}
                className="flex flex-col gap-12 md:gap-20"
                initial="hidden"
                animate="visible"
                exit="hidden"
              >

                {filteredEvents.map((event, index) => {
                  const EventIcon =
                    eventIcons[event.name] ?? CalendarDays;

                  return (
                    <EventRow
                      key={event.name}
                      event={event}
                      index={index}
                      Icon={EventIcon}
                      isRight={index % 2 === 0}
                      passed={passedEvents.has(index)}
                      markerRef={(element) => {
                        markerRefs.current[index] = element;
                      }}
                      variants={cardVariants}
                    />
                  );
                })}

              </motion.div>

            </AnimatePresence>

          ) : (

            <div className="rounded-lg border border-[#FF2E93]/20 px-5 py-16 text-center text-sm text-[#A99AA5]">
              No events found in this category.
            </div>

          )}

        </div>

        {/* ENDING */}

        <div className="mt-20 flex items-center justify-center gap-4 font-['Orbitron'] text-[10px] tracking-[0.25em] text-[#FF2E93]">
          <span className="h-px w-9 bg-[#FF2E93]" />
          END OF TRANSMISSION
          <span className="h-px w-9 bg-[#FF2E93]" />
        </div>

      </div>
    </section>
  );
}


// INDIVIDUAL TIMELINE EVENT

interface EventRowProps {
  event: TimelineEvent;
  index: number;
  Icon: LucideIcon;
  isRight: boolean;
  passed: boolean;
  markerRef: (element: HTMLDivElement | null) => void;

  variants: {
    hidden: {
      opacity: number;
      y: number;
    };

    visible: {
      opacity: number;
      y: number;

      transition: {
        duration: number;
        ease: "easeOut";
      };
    };
  };
}

function EventRow({
  event,
  index,
  Icon,
  isRight,
  passed,
  markerRef,
  variants,
}: EventRowProps) {
  const categoryClass = categoryColors[event.category];
  const categoryLabel = categoryDescriptions[event.category];

  return (
    <motion.article
      variants={variants}
      className="relative grid w-full grid-cols-[32px_minmax(0,1fr)] items-start gap-x-4 md:grid-cols-[minmax(0,1fr)_88px_minmax(0,1fr)] md:gap-x-0"
    >
      {/* NUMBERED RAIL NODE */}
      <div
        ref={markerRef}
        className="relative z-20 col-start-1 row-span-2 flex items-start justify-center pt-2 md:col-start-2 md:row-span-1 md:pt-0"
      >
        <motion.div
          animate={{
            borderColor: passed ? "#FF2E93" : "rgba(255,46,147,0.5)",
            backgroundColor: passed ? "#FF2E93" : "#180710",
            color: passed ? "#FFFFFF" : "#FF8BC2",
            boxShadow: passed
              ? "0 0 18px rgba(255,46,147,0.65)"
              : "0 0 8px rgba(255,46,147,0.12)",
          }}
          transition={{ duration: 0.25 }}
          className="flex h-8 w-8 items-center justify-center rounded-full border font-mono text-[10px] font-bold md:h-10 md:w-10"
        >
          {String(index + 1).padStart(2, "0")}
        </motion.div>
      </div>

      {/* TIME + CATEGORY SIDE */}
      <div
        className={`col-start-2 row-start-1 mb-4 min-w-0 md:row-start-1 md:mb-0 md:self-center ${
          isRight
            ? "md:col-start-1 md:pr-12 md:text-right flex flex-col md:items-end"
            : "md:col-start-3 md:pl-12 md:text-left flex flex-col md:items-start"
        }`}
      >
        <span className="mb-2 font-mono text-[9px] tracking-[0.25em] text-[#A99AA5]">
          EVENT TIME
        </span>

        <h3 className="font-['Orbitron'] text-xl font-black tracking-tight text-white sm:text-2xl lg:text-3xl mb-3">
          {event.time}
        </h3>

        <div className={`flex items-center ${isRight ? "md:justify-end" : "md:justify-start"}`}>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1.5 font-mono text-[9px] font-semibold tracking-wider ${categoryClass}`}
          >
            {categoryLabel}
          </span>
        </div>

        <div
          className={`mt-4 hidden h-px w-20 bg-gradient-to-r from-[#FF2E93]/70 to-transparent md:block ${
            isRight
              ? "md:ml-auto md:bg-gradient-to-l md:from-[#FF2E93]/70 md:to-transparent"
              : ""
          }`}
        />
      </div>

      {/* EVENT CARD */}
      <div
        className={`col-start-2 row-start-2 min-w-0 md:row-start-1 ${
          isRight
            ? "md:col-start-3 md:pl-12"
            : "md:col-start-1 md:pr-12"
        }`}
      >
        <div
          className={`group relative w-full overflow-hidden rounded-xl border border-[#FF2E93]/25 bg-gradient-to-br from-[#230A18]/95 via-[#180710]/95 to-[#0C050A]/95 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#FF2E93]/70 hover:shadow-[0_12px_35px_rgba(255,46,147,0.14)] sm:p-7 lg:p-8 ${
            isRight ? "md:mr-auto" : "md:ml-auto"
          }`}
        >
          {/* SUBTLE CARD GLOW */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#FF2E93]/[0.07] blur-3xl transition-all duration-500 group-hover:bg-[#FF2E93]/[0.13]" />

          {/* EVENT NAME + ICON */}
          <div className="relative mb-5 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#FF2E93]/30 bg-[#FF2E93]/10 text-[#FF8BC2] transition-all duration-300 group-hover:border-[#FF2E93]/70 group-hover:bg-[#FF2E93]/20">
              <Icon size={23} strokeWidth={1.8} />
            </div>

            <h3 className="min-w-0 font-['Orbitron'] text-lg font-bold tracking-wide text-[#F5F0F5] sm:text-xl lg:text-2xl">
              {event.name}
            </h3>
          </div>

          {/* DESCRIPTION */}
          <p className="relative mb-6 text-sm leading-7 text-[#BDAEB8]">
            {event.description ||
              `Step into ${event.name} and put your skills to the test. Be part of the experience at Fiestron 2026.`}
          </p>

          {/* VENUE */}
          <div className="relative mb-6 flex items-center gap-3 border-t border-white/[0.07] pt-5 text-sm text-[#D7C5D1]">
            <MapPin size={17} className="shrink-0 text-[#FF2E93]" />
            <span>{event.venue}</span>
          </div>

          {/* BUTTONS */}
          <div className="relative flex flex-wrap items-center gap-3">
            <a
              href={event.registrationUrl ?? "#register"}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#FF2E93]/50 bg-[#FF2E93]/10 px-5 py-3 font-['Orbitron'] text-[10px] font-semibold tracking-wider text-white transition-all duration-300 hover:border-[#FF2E93] hover:bg-[#FF2E93] hover:shadow-[0_0_18px_rgba(255,46,147,0.35)]"
            >
              REGISTER
              <ArrowUpRight size={14} />
            </a>

            <a
              href={event.rulesUrl ?? "#rules"}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#9D4EDD]/50 bg-[#9D4EDD]/10 px-5 py-3 font-['Orbitron'] text-[10px] font-semibold tracking-wider text-[#E9D8F5] transition-all duration-300 hover:border-[#9D4EDD] hover:bg-[#9D4EDD]/30"
            >
              RULES & REGULATIONS
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}