export interface FestEvent {
  id: string;
  number: string;
  name: string;
  category: string;
  categoryPill?: string;
  format: string;
  tagline: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  venue: string;
  teamSize: string;
  fee: number | null;
  prizePool: string;
  registerUrl?: string;
  rulesUrl?: string;
  images: [string, string, string];
}

export const REGISTRATION_URL = "#register";
export const RULES_URL = "#rules";

export const EVENTS: FestEvent[] = [
  {
    id: "code-paradox",
    number: "01",
    name: "Code Paradox",
    category: "TECHNICAL",
    categoryPill: "TECHNICAL EVENT",
    format: "INDIVIDUAL OR DUO · TIMED SPRINT",
    tagline: "Patch yesterday's bugs before tomorrow's loop closes.",
    description:
      "Placeholder event brief — step into a shifting codebase where familiar algorithms behave differently across rounds. Debug legacy snippets, optimize under tight constraints, and decode the paradox before time resets.",
    date: "TBD · Fiestron 2026",
    time: "TBD",
    duration: "3 Hours",
    venue: "K.C. College · Computing Lab (TBD)",
    teamSize: "1 – 2 Members",
    fee: null,
    prizePool: "TBD",
    registerUrl: REGISTRATION_URL,
    rulesUrl: RULES_URL,
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=85",
    ],
  },
  {
    id: "glitch-arena",
    number: "02",
    name: "Glitch Arena",
    category: "GAMING",
    categoryPill: "GAMING EVENT",
    format: "SQUAD & SOLO BRACKETS · LIVE PLAY",
    tagline: "Every frame matters when the rules bend mid-match.",
    description:
      "Placeholder event brief — fast-paced competitive showdowns built around sharp reflexes, map awareness, and split-second adaptation when unexpected modifiers hit the arena.",
    date: "TBD · Fiestron 2026",
    time: "TBD",
    duration: "4 Hours",
    venue: "K.C. College · Arena Zone (TBD)",
    teamSize: "1 – 5 Members",
    fee: null,
    prizePool: "TBD",
    registerUrl: REGISTRATION_URL,
    rulesUrl: RULES_URL,
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=1400&q=85",
    ],
  },
  {
    id: "chrono-frame",
    number: "03",
    name: "Chrono Frame",
    category: "CREATIVE",
    categoryPill: "NON-TECHNICAL EVENT",
    format: "SOLO OR CREW · VISUAL STORYTELLING",
    tagline: "Freeze a memory from the past and render it for the future.",
    description:
      "Placeholder event brief — combine visual framing, rhythm, and atmosphere to tell a story across eras. Craft striking stills or short sequences that turn nostalgia into a bold new perspective.",
    date: "TBD · Fiestron 2026",
    time: "TBD",
    duration: "2.5 Hours",
    venue: "K.C. College · Creative Studio (TBD)",
    teamSize: "1 – 3 Members",
    fee: null,
    prizePool: "TBD",
    registerUrl: REGISTRATION_URL,
    rulesUrl: RULES_URL,
    images: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=85",
    ],
  },
  {
    id: "deja-hack",
    number: "04",
    name: "Deja Hack",
    category: "HACKATHON",
    categoryPill: "TECHNICAL EVENT",
    format: "TEAM BUILD · RAPID PROTOTYPING",
    tagline: "Ship a working idea—then rewire it when the prompt shifts.",
    description:
      "Placeholder event brief — collaborative building from scratch to demo under clock pressure. Teams design, code, and pitch practical or experimental builds before a surprise twist tests adaptability.",
    date: "TBD · Fiestron 2026",
    time: "TBD",
    duration: "6 Hours",
    venue: "K.C. College · Main Hack Hall (TBD)",
    teamSize: "2 – 4 Members",
    fee: null,
    prizePool: "TBD",
    registerUrl: REGISTRATION_URL,
    rulesUrl: RULES_URL,
    images: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=85",
    ],
  },
  {
    id: "reality-shift",
    number: "05",
    name: "Reality Shift",
    category: "AI & AR",
    categoryPill: "TECHNICAL EVENT",
    format: "SOLO OR TRIO · INTERACTIVE LAB",
    tagline: "Blur the line between screen, lens, and physical space.",
    description:
      "Placeholder event brief — explore generative workflows, shaders, and interactive filters that react in real time. Turn static concepts into responsive visual experiences built for modern screens.",
    date: "TBD · Fiestron 2026",
    time: "TBD",
    duration: "3 Hours",
    venue: "K.C. College · Innovation Lab (TBD)",
    teamSize: "1 – 3 Members",
    fee: null,
    prizePool: "TBD",
    registerUrl: REGISTRATION_URL,
    rulesUrl: RULES_URL,
    images: [
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=85",
    ],
  },
  {
    id: "ui-loop-lab",
    number: "06",
    name: "UI Loop Lab",
    category: "DESIGN",
    categoryPill: "NON-TECHNICAL EVENT",
    format: "SOLO OR DUO · INTERFACE CHALLENGE",
    tagline: "Design motion and hierarchy that feel effortless on first touch.",
    description:
      "Placeholder event brief — craft high-contrast interfaces, clear information flow, and tactile motion states. Focus on typography, spacing, and interactions that guide users naturally through a loop.",
    date: "TBD · Fiestron 2026",
    time: "TBD",
    duration: "2.5 Hours",
    venue: "K.C. College · Design Room (TBD)",
    teamSize: "1 – 2 Members",
    fee: null,
    prizePool: "TBD",
    registerUrl: REGISTRATION_URL,
    rulesUrl: RULES_URL,
    images: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1400&q=85",
    ],
  },
  {
    id: "cipher-quest",
    number: "07",
    name: "Cipher Quest",
    category: "TECHNICAL",
    categoryPill: "TECHNICAL EVENT",
    format: "SOLO OR TRIO · INVESTIGATION",
    tagline: "Follow the signal through layers of clues and hidden logic.",
    description:
      "Placeholder event brief — track down encoded leads, spot subtle anomalies, and piece together multi-step puzzles. Rewarding curiosity, careful reading, and structured deduction under a timer.",
    date: "TBD · Fiestron 2026",
    time: "TBD",
    duration: "3 Hours",
    venue: "K.C. College · Seminar Space (TBD)",
    teamSize: "1 – 3 Members",
    fee: null,
    prizePool: "TBD",
    registerUrl: REGISTRATION_URL,
    rulesUrl: RULES_URL,
    images: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&w=1400&q=85",
    ],
  },
  {
    id: "replay-rush",
    number: "08",
    name: "Replay Rush",
    category: "FUN",
    categoryPill: "CARNIVAL EVENT",
    format: "SQUAD CHALLENGE · FAST ROUNDS",
    tagline: "High energy, quick pivots, and instant replay moments.",
    description:
      "Placeholder event brief — rapid-fire team rounds and crowd-energizing challenges designed to keep momentum high. Every round brings a fresh twist where teamwork and quick thinking decide the score.",
    date: "TBD · Fiestron 2026",
    time: "TBD",
    duration: "2 Hours",
    venue: "K.C. College · Activity Hall (TBD)",
    teamSize: "2 – 4 Members",
    fee: null,
    prizePool: "TBD",
    registerUrl: REGISTRATION_URL,
    rulesUrl: RULES_URL,
    images: [
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=85",
    ],
  },
];