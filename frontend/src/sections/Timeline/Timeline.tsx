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
  Technical: "border-[#AF69FF]/50 bg-[#AF69FF]/10 text-[#E3CCFF]",
  "Non-Technical": "border-[#7A2FD6]/50 bg-[#7A2FD6]/10 text-[#E3CCFF]",
  Gaming: "border-[#9147FF]/50 bg-[#9147FF]/10 text-[#E3CCFF]",
  Carnival: "border-[#C77DFF]/50 bg-[#C77DFF]/10 text-[#E3CCFF]",
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
      className="timeline-section relative isolate w-full overflow-hidden bg-transparent px-5 py-28 sm:px-8 lg:px-12 2xl:px-16"
    >
      

      <div className="pointer-events-none absolute inset-0 z-[1] bg-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1100px]">

        {/* SECTION HEADING */}

        <header className="mb-16 text-center">
          <p className="mb-5 flex items-center justify-center gap-4 font-mono text-[10px] font-bold tracking-[0.35em] text-[#AF69FF]">
            <span className="h-[2px] w-9 bg-[#AF69FF]" />
            THE COUNTDOWN BEGINS
            <span className="h-[2px] w-9 bg-[#AF69FF]" />
          </p>

          <h2 className="font-['Orbitron'] text-3xl font-black tracking-[0.08em] text-[#FFFFFF] sm:text-5xl lg:text-6xl">
            THE LOOP{" "}
            <span className="text-[#AF69FF] drop-shadow-[0_0_20px_rgba(175,105,255,0.35)]">
              UNFOLDS
            </span>
          </h2>

          <p className="mt-5 text-sm font-medium leading-7 text-[#C5C1CF]">
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
              className={`min-w-32 rounded border-2 px-6 py-3 font-['Orbitron'] text-[11px] font-bold tracking-widest transition-all duration-300 ${
                selectedDay === day
                  ? "border-[#AF69FF] bg-[#AF69FF]/15 text-white shadow-[0_0_22px_rgba(175,105,255,0.2)]"
                  : "border-[#AF69FF]/35 bg-[#12091F]/80 text-[#C5C1CF] hover:border-[#AF69FF]/80 hover:text-white"
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
              className={`rounded-full border-2 px-5 py-2.5 text-[11px] font-semibold tracking-wide transition-all duration-300 ${
                selectedCategory === category
                  ? "border-[#7A2FD6]/80 bg-[#7A2FD6]/20 text-white shadow-[0_0_15px_rgba(122,47,214,0.18)]"
                  : "border-white/15 bg-white/[0.035] text-[#C5C1CF] hover:border-[#7A2FD6]/70 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* EVENT COUNT */}

        <div className="mb-16 flex items-center justify-center gap-3 font-mono text-[10px] font-semibold tracking-[0.2em] text-[#C5C1CF]">
          <span className="font-['Orbitron'] text-2xl font-bold text-[#AF69FF]">
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

          <div className="pointer-events-none absolute bottom-0 left-[15px] top-0 z-0 w-[4px] rounded-full bg-[#291443] shadow-[0_0_12px_rgba(175,105,255,0.18)] md:left-1/2 md:-translate-x-1/2">
            <motion.div
              className="absolute left-0 top-0 h-full w-full origin-top rounded-full bg-gradient-to-b from-[#9147FF] via-[#AF69FF] to-[#D9B8FF] shadow-[0_0_18px_rgba(175,105,255,0.75)]"
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
                className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_0_16px_rgba(175,105,255,0.75)]"
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
            <div className="rounded-lg border-2 border-[#AF69FF]/30 px-5 py-16 text-center text-sm font-semibold text-[#C5C1CF]">
              No events found in this category.
            </div>
          )}
        </div>

        {/* ENDING */}

        <div className="mt-20 flex items-center justify-center gap-4 font-['Orbitron'] text-[10px] font-bold tracking-[0.25em] text-[#AF69FF]">
          <span className="h-[2px] w-9 bg-[#AF69FF]" />
          THIS WASN'T THE END. IT WAS ANOTHER BEGINNING
          <span className="h-[2px] w-9 bg-[#AF69FF]" />
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
            borderColor: passed ? "#AF69FF" : "rgba(175,105,255,0.7)",
            backgroundColor: passed ? "#AF69FF" : "#12091F",
            color: passed ? "#FFFFFF" : "#E3CCFF",
            boxShadow: passed
              ? "0 0 20px rgba(175,105,255,0.75)"
              : "0 0 14px rgba(175,105,255,0.3)",
          }}
          transition={{ duration: 0.25 }}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 font-mono text-[10px] font-bold shadow-[0_0_12px_rgba(175,105,255,0.2)] md:h-10 md:w-10"
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
        <span className="mb-2 font-mono text-[10px] font-bold tracking-[0.25em] text-[#C5C1CF]">
          EVENT TIME
        </span>

        <h3 className="mb-3 font-['Orbitron'] text-xl font-black tracking-tight text-white sm:text-2xl lg:text-3xl">
          {event.time}
        </h3>

        <div
          className={`flex items-center ${
            isRight ? "md:justify-end" : "md:justify-start"
          }`}
        >
          <span
            className={`inline-flex items-center rounded-full border-2 px-3 py-1.5 font-mono text-[9px] font-bold tracking-wider ${categoryClass}`}
          >
            {categoryLabel}
          </span>
        </div>

        <div
          className={`mt-4 hidden h-[2px] w-24 bg-gradient-to-r from-[#AF69FF] to-transparent md:block ${
            isRight
              ? "md:ml-auto md:bg-gradient-to-l md:from-[#AF69FF] md:to-transparent"
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
          className={`group relative w-full overflow-hidden rounded-xl border-2 border-[#AF69FF]/55 bg-gradient-to-br from-[#291443]/95 via-[#12091F]/95 to-[#0C0714]/95 p-5 backdrop-blur-xl shadow-[0_0_18px_rgba(175,105,255,0.22),0_0_38px_rgba(145,71,255,0.10),inset_0_0_20px_rgba(175,105,255,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[#AF69FF] hover:shadow-[0_0_25px_rgba(175,105,255,0.38),0_0_55px_rgba(145,71,255,0.18),0_12px_35px_rgba(175,105,255,0.2)] sm:p-7 lg:p-8 ${
            isRight ? "md:mr-auto" : "md:ml-auto"
          }`}
        >

          {/* SQUARE CARD GLOW */}

          <div className="pointer-events-none absolute inset-0 rounded-xl border border-[#AF69FF]/15 bg-gradient-to-br from-[#AF69FF]/[0.045] via-transparent to-[#9147FF]/[0.06] opacity-100 transition-all duration-500 group-hover:from-[#AF69FF]/[0.10] group-hover:to-[#9147FF]/[0.12]" />

          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#AF69FF]/[0.10] blur-3xl transition-all duration-500 group-hover:bg-[#AF69FF]/[0.18]" />

          {/* EVENT NAME + ICON */}

          <div className="relative mb-5 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-[#AF69FF]/40 bg-[#AF69FF]/10 text-[#E3CCFF] transition-all duration-300 group-hover:border-[#AF69FF]/80 group-hover:bg-[#AF69FF]/20">
              <Icon size={23} strokeWidth={2} />
            </div>

            <h3 className="min-w-0 font-['Orbitron'] text-lg font-extrabold tracking-wide text-white sm:text-xl lg:text-2xl">
              {event.name}
            </h3>
          </div>

          {/* DESCRIPTION */}

          <p className="relative mb-6 text-sm font-medium leading-7 text-[#D9D4E2]">
            {event.description ||
              `Step into ${event.name} and put your skills to the test. Be part of the experience at Fiestron 2026.`}
          </p>

          {/* VENUE */}

          <div className="relative mb-6 flex items-center gap-3 border-t-2 border-white/[0.10] pt-5 text-sm font-medium text-[#D9D4E2]">
            <MapPin size={17} className="shrink-0 text-[#AF69FF]" />
            <span>{event.venue}</span>
          </div>

          {/* BUTTONS */}

          <div className="relative flex flex-wrap items-center gap-3">
            <a
              href={event.registrationUrl ?? "#register"}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-[#AF69FF]/60 bg-[#AF69FF]/10 px-5 py-3 font-['Orbitron'] text-[10px] font-bold tracking-wider text-white transition-all duration-300 hover:border-[#AF69FF] hover:bg-[#AF69FF] hover:shadow-[0_0_18px_rgba(175,105,255,0.35)]"
            >
              REGISTER
              <ArrowUpRight size={14} />
            </a>

            <a
              href={event.rulesUrl ?? "#rules"}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-[#7A2FD6]/60 bg-[#7A2FD6]/10 px-5 py-3 font-['Orbitron'] text-[10px] font-bold tracking-wider text-[#E3CCFF] transition-all duration-300 hover:border-[#7A2FD6] hover:bg-[#7A2FD6]/30"
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