export type EventCategory =
  | "Technical"
  | "Non-Technical"
  | "Gaming"
  | "Carnival";

export type EventDate =
  | "16 DEC"
  | "17 DEC"
  | "BOTH DAYS";

export interface TimelineEvent {
  name: string;
  category: EventCategory;
  date: EventDate;
  time: string;
  venue: string;
  description?: string;
  registrationUrl?: string;
  rulesUrl?: string;
}

export const timelineEvents: TimelineEvent[] = [
  // 16 DECEMBER 2026

  {
    name: "Code Quest",
    category: "Technical",
    date: "16 DEC",
    time: "11:30 AM – 1:30 PM",
    venue: "CS Lab",
  },
  {
    name: "BGMI",
    category: "Gaming",
    date: "16 DEC",
    time: "11:30 AM onwards",
    venue: "Online / Classroom",
  },
  {
    name: "Chess",
    category: "Gaming",
    date: "16 DEC",
    time: "11:30 AM – 4:00 PM",
    venue: "Sports Room",
  },
  {
    name: "Carrom",
    category: "Gaming",
    date: "16 DEC",
    time: "11:30 AM – 4:00 PM",
    venue: "Sports Room",
  },
  {
    name: "Box Cricket",
    category: "Gaming",
    date: "16 DEC",
    time: "11:30 AM onwards",
    venue: "Quadrangle",
  },
  {
    name: "Logo Lore",
    category: "Non-Technical",
    date: "16 DEC",
    time: "1:00 PM onwards",
    venue: "Any Classroom",
  },
  {
    name: "Geocities.AI",
    category: "Technical",
    date: "16 DEC",
    time: "2:00 PM onwards",
    venue: "CS Lab (Hardware)",
  },
  {
    name: "Retro Rendered",
    category: "Technical",
    date: "16 DEC",
    time: "2:00 PM onwards",
    venue: "CS Lab (Software)",
  },
  {
    name: "One Mic Stand",
    category: "Non-Technical",
    date: "16 DEC",
    time: "3:00 PM onwards",
    venue: "Any Classroom",
  },
  {
    name: "Brain Buster",
    category: "Non-Technical",
    date: "16 DEC",
    time: "4:30 PM onwards",
    venue: "Any Classroom / CS Lab",
  },

  // 17 DECEMBER 2026

  {
    name: "Hackathon",
    category: "Technical",
    date: "17 DEC",
    time: "9:30 AM – 11:30 AM",
    venue: "CS Lab",
  },
  {
    name: "Table Tennis",
    category: "Gaming",
    date: "17 DEC",
    time: "9:00 AM – 1:00 PM",
    venue: "Sports Room",
  },
  {
    name: "Vintage Ventures",
    category: "Technical",
    date: "17 DEC",
    time: "11:00 AM onwards",
    venue: "Any Classroom",
  },
  {
    name: "Syntax Sprint",
    category: "Technical",
    date: "17 DEC",
    time: "12:00 PM – 2:00 PM",
    venue: "CS Lab",
  },
  {
    name: "Design.exe",
    category: "Technical",
    date: "17 DEC",
    time: "2:30 PM onwards",
    venue: "CS Lab (Outer)",
  },
  {
    name: "FIFA Tournament",
    category: "Gaming",
    date: "17 DEC",
    time: "2:30 PM onwards",
    venue: "CS Lab (Inner)",
  },
  {
    name: "Escape Protocol",
    category: "Non-Technical",
    date: "17 DEC",
    time: "2:00 PM – 5:00 PM",
    venue: "Sports Room",
  },
  {
    name: "Meme Mania",
    category: "Non-Technical",
    date: "17 DEC",
    time: "2:00 PM onwards",
    venue: "Any Classroom",
  },
  {
    name: "Netflix Trivia",
    category: "Gaming",
    date: "17 DEC",
    time: "3:30 PM onwards",
    venue: "Any Classroom",
  },
  {
    name: "Ad-A-Bit",
    category: "Non-Technical",
    date: "17 DEC",
    time: "4:30 PM onwards",
    venue: "Any Classroom",
  },

  // CARNIVAL — BOTH DAYS

  {
    name: "Coin Drop Challenge",
    category: "Carnival",
    date: "BOTH DAYS",
    time: "All Day",
    venue: "Quadrangle",
  },
  {
    name: "Stack Attack",
    category: "Carnival",
    date: "BOTH DAYS",
    time: "All Day",
    venue: "Quadrangle",
  },
  {
    name: "Ticket Toss",
    category: "Carnival",
    date: "BOTH DAYS",
    time: "All Day",
    venue: "Quadrangle",
  },
  {
    name: "Brick Balance",
    category: "Carnival",
    date: "BOTH DAYS",
    time: "All Day",
    venue: "Quadrangle",
  },
  {
    name: "Elbow Flip",
    category: "Carnival",
    date: "BOTH DAYS",
    time: "All Day",
    venue: "Quadrangle",
  },
  {
    name: "Blow the Ball",
    category: "Carnival",
    date: "BOTH DAYS",
    time: "All Day",
    venue: "Quadrangle",
  },
  {
    name: "Rubber Band Shot",
    category: "Carnival",
    date: "BOTH DAYS",
    time: "All Day",
    venue: "Quadrangle",
  },
  {
    name: "Straw Suction",
    category: "Carnival",
    date: "BOTH DAYS",
    time: "All Day",
    venue: "Quadrangle",
  },
  {
    name: "Emoji Riddle",
    category: "Carnival",
    date: "BOTH DAYS",
    time: "All Day",
    venue: "Quadrangle",
  },
  {
    name: "Color Trick",
    category: "Carnival",
    date: "BOTH DAYS",
    time: "All Day",
    venue: "Quadrangle",
  },
  {
    name: "7 Up 7 Down",
    category: "Carnival",
    date: "BOTH DAYS",
    time: "All Day",
    venue: "Quadrangle",
  },
  {
    name: "Confusing Words",
    category: "Carnival",
    date: "BOTH DAYS",
    time: "All Day",
    venue: "Quadrangle",
  },
  {
    name: "Penny Stack",
    category: "Carnival",
    date: "BOTH DAYS",
    time: "All Day",
    venue: "Quadrangle",
  },
  {
    name: "Paper Ball Basket",
    category: "Carnival",
    date: "BOTH DAYS",
    time: "All Day",
    venue: "Quadrangle",
  },
];