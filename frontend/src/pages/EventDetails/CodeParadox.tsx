import EventDetailsNavbar from "../../components/EventDetailsLayout/EventDetailsNavbar";
import EventDetailsFooter from "../../components/EventDetailsLayout/EventDetailsFooter";

import {
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
    <main className="flex min-h-screen flex-col overflow-x-hidden bg-[#06040A] text-white">
      <EventDetailsNavbar />

      {/* Hero banner */}
      <section className="relative isolate w-full pt-[76px]">
        {/* Background photo */}
        <div
          className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=2000&q=85')",
          }}
          aria-hidden="true"
        />

        {/* Subtle dark + violet tint */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#06040A]/75 via-[#0B0713]/65 to-[#160D26]/90"
          aria-hidden="true"
        />

        <div className="mx-auto w-full max-w-6xl px-6 pt-12 pb-28 sm:px-10 sm:pt-16">
          <span className="mb-4 inline-block rounded-full border border-[#AF69FF]/40 bg-[#AF69FF]/15 px-3.5 py-1 font-mono text-[11px] font-medium tracking-[0.2em] text-[#D9B8FF]">
            TECHNICAL EVENT
          </span>

          <p className="mb-2 font-mono text-xs tracking-[0.28em] text-[#A99AA5]">
            EVENT 01 <span className="text-[#AF69FF]">/</span> FIESTRON 2026
          </p>

          <h1 className="mb-3 font-['Orbitron'] text-4xl font-extrabold uppercase tracking-wide text-white sm:text-6xl">
            CODE PARADOX
          </h1>

          <p className="max-w-2xl text-base text-[#D4CEDE] sm:text-lg">
            Bridging the foundational era of computing and modern algorithmic optimization.
          </p>
        </div>
      </section>

      {/* Overlapping 6-column metadata bar */}
      <div className="relative z-10 mx-auto -mt-14 w-full max-w-6xl px-6 sm:px-10">
        <div className="relative rounded-2xl border border-white/10 bg-[#0D0A14] py-5">
          <span
            className="pointer-events-none absolute top-2.5 left-2.5 h-3 w-3 border-t border-l border-[#AF69FF]/75"
            aria-hidden="true"
          />
          <span
            className="pointer-events-none absolute right-2.5 bottom-2.5 h-3 w-3 border-r border-b border-[#AF69FF]/75"
            aria-hidden="true"
          />

          <div className="grid grid-cols-2 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:grid-cols-6">
            {EVENT_SPECS.map((item) => (
              <div key={item.label} className="px-6 py-3 sm:py-1">
                <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] tracking-[0.2em] text-[#8E829E]">
                  <item.icon size={13} className="text-[#AF69FF]" />
                  <span>{item.label}</span>
                </div>

                <p
                  className={`text-sm font-semibold sm:text-base ${
                    item.label === "PRIZE"
                      ? "font-['Orbitron'] text-[#D9B8FF]"
                      : "text-white"
                  }`}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main page sections */}
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 pt-16 pb-20 sm:px-10">
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

            <span className="rounded-full border border-[#AF69FF]/40 bg-[#AF69FF]/10 px-4 py-1.5 font-mono text-[11px] tracking-[0.2em] text-[#D9B8FF]">
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
                className="rounded-2xl border border-white/10 bg-[#0F0B17] p-6"
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

        {/* Rules and guidelines */}
        <section className="mb-14">
          <h3 className="mb-6 flex items-center gap-2.5 font-['Orbitron'] text-sm font-bold tracking-[0.2em] text-white">
            <span className="inline-block h-4 w-[3px] rounded-full bg-[#AF69FF]" />
            RULES & GUIDELINES
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {RULES.map((rule, index) => (
              <div
                key={rule.label}
                className="flex items-start gap-4 rounded-xl border border-white/10 bg-[#0F0B17] p-5"
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

        {/* Registration button */}
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

      <EventDetailsFooter />
    </main>
  );
}