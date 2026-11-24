import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";

const REGISTER_LINK = "#register"; 

const EVENT_SPECS = [
  {
    icon: CalendarDays,
    label: "DATE",
    value: "15 Dec 2026",
  },
  {
    icon: Clock,
    label: "TIME",
    value: "11:30 AM – 1:30 PM",
  },
  {
    icon: MapPin,
    label: "VENUE",
    value: "CS Lab",
  },
  {
    icon: Users,
    label: "TEAM",
    value: "Team of 2",
  },
  {
    icon: Ticket,
    label: "ENTRY",
    value: "₹100",
  },
  {
    icon: Trophy,
    label: "PRIZE",
    value: "5,000 / 2,500 PR",
  },
];

const ROUNDS = [
  {
    step: "ROUND 01 · 20 MINS",
    title: "Retro Rush",
    description:
      "Elimination round testing your theoretical foundation. Teams face 30 MCQs covering C/C++ output tracing, pointer arithmetic, and 90s tech trivia. No compilers allowed.",
  },
  {
    step: "ROUND 02 · 20 MINS",
    title: "Typing Titan",
    description:
      "A test of syntax memory and raw typing speed. Transcribe a printed sheet of vintage code (BASIC/COBOL) or complex Java/C++ boilerplate into the IDE with zero syntax errors against the clock.",
  },
  {
    step: "ROUND 03 · 60 MINS",
    title: "The Optimizer",
    description:
      "The final showdown. Teams receive 3 working brute-force algorithmic problems and must refactor them to pass hidden test cases within stricter time limits (e.g., reducing O(n²) to O(n)).",
  },
];

const RULES = [
  {
    label: "Mandatory Attendance",
    text: "Participation in all three rounds is compulsory. Missing a round leads to immediate disqualification.",
  },
  {
    label: "Internet Policy",
    text: "Strictly NO internet access for Round 1 and Round 2. Limited access to official documentation may be allowed in Round 3 at the judge's discretion.",
  },
  {
    label: "Hardware",
    text: "Participants are strongly advised to bring their own laptops with VS Code and GCC/Python/Java compilers pre-installed to avoid compatibility issues.",
  },
  {
    label: "Plagiarism",
    text: "Any code found to be copied from another team or generated via unauthorized AI tools (ChatGPT/Copilot) will result in an instant ban from the event.",
  },
  {
    label: "Time Adherence",
    text: "The submission portal closes exactly when the timer hits zero. No grace period will be given for file uploads.",
  },
  {
    label: "Language Restrictions",
    text: "Solutions must be submitted in C, C++, Java, or Python unless a specific problem statement mandates a different language.",
  },
];

export default function CodeParadox() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#06040A] text-white">
      {/* Top ambient glow and subtle grid */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_at_50%_15%,rgba(145,71,255,0.26),rgba(18,9,31,0.52)_55%,transparent_80%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-20 [background-image:linear-gradient(to_right,rgba(175,105,255,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(175,105,255,0.16)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black_35%,transparent_100%)]"
        aria-hidden="true"
      />

      {/* Top pill bar */}
      <header className="sticky top-5 z-40 mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="flex items-center justify-between rounded-full border border-[#AF69FF]/30 bg-[#0E0916]/85 px-5 py-2.5 shadow-[0_12px_36px_rgba(0,0,0,0.65)] backdrop-blur-md">
          <Link
            to="/home"
            className="font-['Orbitron'] text-sm font-extrabold tracking-[0.2em] text-white transition hover:text-[#D9B8FF]"
          >
            FIESTRON
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/home#events"
              className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.18em] text-[#C5C1CF] transition hover:text-[#D9B8FF]"
            >
              <ArrowLeft size={14} className="text-[#AF69FF]" />
              ALL EVENTS
            </Link>

            <a
              href={REGISTER_LINK}
              className="rounded-full bg-white px-5 py-2 font-mono text-xs font-bold tracking-[0.18em] text-[#06040A] transition hover:bg-[#D9B8FF]"
            >
              REGISTER
            </a>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-6 pt-14 pb-20 sm:px-10">
        {/* Upper hero + spec strip */}
        <section className="mb-16">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#AF69FF]/45 bg-[#AF69FF]/15 px-3.5 py-1 font-mono text-[11px] font-semibold tracking-[0.22em] text-[#D9B8FF] shadow-[0_0_20px_rgba(175,105,255,0.22)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D9B8FF] shadow-[0_0_8px_#AF69FF]" />
              TECHNICAL EVENT
            </span>

            <span className="font-mono text-xs tracking-[0.28em] text-[#8E829E]">
              EVENT 01 <span className="text-[#AF69FF]">/</span> FIESTRON 2026
            </span>
          </div>

          {/* Creative split display heading */}
          <div className="relative mb-5">
            <span
              className="pointer-events-none absolute -top-5 left-0 select-none font-['Orbitron'] text-5xl font-black uppercase tracking-[0.18em] text-[#AF69FF]/[0.06] sm:text-7xl lg:text-8xl"
              aria-hidden="true"
            >
              PARADOX
            </span>

            <h1 className="relative font-['Orbitron'] text-4xl font-black uppercase tracking-[0.06em] sm:text-6xl lg:text-7xl">
              <span className="text-white drop-shadow-[0_0_24px_rgba(175,105,255,0.3)]">
                CODE{" "}
              </span>
              <span className="bg-gradient-to-r from-[#D9B8FF] via-[#AF69FF] to-[#7A2FD6] bg-clip-text text-transparent">
                PARADOX
              </span>
            </h1>

            <div className="mt-4 flex items-center gap-3" aria-hidden="true">
              <span className="h-[2px] w-14 rounded-full bg-gradient-to-r from-[#AF69FF] to-transparent" />
              <span className="h-1 w-1 rounded-full bg-[#D9B8FF]" />
           
            </div>
          </div>

          <p className="max-w-2xl text-base leading-relaxed text-[#C5C1CF] sm:text-lg">
            Bridging the foundational era of computing and modern algorithmic optimization.
          </p>

          {/* 6-column metadata bar */}
          <div className="relative mt-10 rounded-2xl border border-[#AF69FF]/25 bg-[#110B1C]/90 px-6 py-6 shadow-[0_20px_50px_rgba(0,0,0,0.55)] sm:px-8">
            <span
              className="pointer-events-none absolute top-2.5 left-2.5 h-3 w-3 border-t border-l border-[#D9B8FF]/60"
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute right-2.5 bottom-2.5 h-3 w-3 border-r border-b border-[#D9B8FF]/60"
              aria-hidden="true"
            />

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {EVENT_SPECS.map((item) => (
                <div key={item.label}>
                  <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] tracking-[0.2em] text-[#8E829E]">
                    <item.icon size={13} className="text-[#AF69FF]" />
                    <span>{item.label}</span>
                  </div>

                  <p className="text-sm font-semibold text-white sm:text-base">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Event overview */}
        <section className="mb-16">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="mb-2 font-mono text-xs tracking-[0.28em] text-[#8E829E]">
                THE BRIEFING
              </p>
              <h2 className="font-['Orbitron'] text-2xl font-bold uppercase tracking-wider sm:text-3xl">
                ABOUT THE <span className="text-[#AF69FF]">EVENT</span>
              </h2>
            </div>

            <span className="rounded-full border border-[#AF69FF]/45 bg-[#AF69FF]/10 px-4 py-1.5 font-mono text-[11px] tracking-[0.2em] text-[#D9B8FF]">
              TEAM OF 2
            </span>
          </div>

          <div className="mt-8 max-w-4xl">
            <h3 className="mb-4 flex items-center gap-2.5 font-['Orbitron'] text-sm font-bold tracking-[0.2em] text-white">
              <span className="inline-block h-4 w-[3px] rounded-full bg-[#AF69FF]" />
              OVERVIEW
            </h3>

            <p className="text-base leading-8 text-[#C5C1CF]">
              Code Paradox is designed to be a rigorous test of a programmer's true mettle. It is not merely about writing code that works; it is about writing code that endures. The event bridges the gap between the foundational era of computing and the modern age of optimization. Participants will be thrust into a high-pressure environment where they must navigate through history—starting with pen-and-paper logic that mimics the punch-card era, moving into a typing sprint involving legacy languages like COBOL and BASIC, and finally culminating in a modern algorithmic showdown where Big-O complexity matters more than just output. This is a battleground for those who understand the roots of Computer Science.
            </p>
          </div>
        </section>

        {/* Rounds and structure */}
        <section className="mb-16">
          <h3 className="mb-6 flex items-center gap-2.5 font-['Orbitron'] text-sm font-bold tracking-[0.2em] text-white">
            <span className="inline-block h-4 w-[3px] rounded-full bg-[#AF69FF]" />
            ROUNDS & STRUCTURE
          </h3>

          <div className="grid gap-5 md:grid-cols-3">
            {ROUNDS.map((round) => (
              <div
                key={round.title}
                className="rounded-2xl border border-[#AF69FF]/25 bg-[#12091F] p-6"
              >
                <p className="mb-2 font-mono text-xs tracking-[0.2em] text-[#AF69FF]">
                  {round.step}
                </p>
                <h4 className="mb-3 font-['Orbitron'] text-lg font-bold text-white">
                  {round.title}
                </h4>
                <p className="text-sm leading-7 text-[#C5C1CF]">
                  {round.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Rules and guidelines with numbering */}
        <section className="mb-14">
          <h3 className="mb-6 flex items-center gap-2.5 font-['Orbitron'] text-sm font-bold tracking-[0.2em] text-white">
            <span className="inline-block h-4 w-[3px] rounded-full bg-[#AF69FF]" />
            RULES & GUIDELINES
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {RULES.map((rule, index) => (
              <div
                key={rule.label}
                className="flex items-start gap-4 rounded-xl border border-white/10 bg-[#110B1C] p-5 transition hover:border-[#AF69FF]/35"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#AF69FF]/35 bg-[#AF69FF]/10 font-mono text-xs font-bold text-[#D9B8FF]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h4 className="mb-1.5 font-['Orbitron'] text-sm font-semibold text-white">
                    {rule.label}
                  </h4>
                  <p className="text-sm leading-relaxed text-[#C5C1CF]">
                    {rule.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Simple registration button with placeholder link */}
        <div>
          <a
            href={REGISTER_LINK}
            className="inline-flex items-center gap-2.5 rounded-lg bg-[#AF69FF] px-7 py-3.5 font-mono text-sm font-bold tracking-[0.15em] text-black transition hover:bg-[#D9B8FF]"
          >
            REGISTER NOW
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>

      {/* Bottom strip matching reference screenshot */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-7 sm:px-10">
          <Link
            to="/home#events"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.22em] text-[#8E829E] transition hover:text-[#D9B8FF]"
          >
            <ArrowLeft size={14} className="text-[#AF69FF]" />
            BACK TO ALL EVENTS
          </Link>

          <p className="font-mono text-[11px] tracking-[0.24em] text-[#6E647D]">
            © 2026 TECH CLUB · FIESTRON 2026
          </p>
        </div>
      </div>
    </main>
  );
}