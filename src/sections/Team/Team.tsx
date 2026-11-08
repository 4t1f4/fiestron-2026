import { useEffect, useRef } from "react";
import { initAbout } from "../About/about";
import "./team.css";

type Person = {
  name: string;
  role: string;
  emoji?: string;
};

type Department = {
  name: string;
  icon: string;
  description: string;
  people: Person[];
};


// Please verify all names, spellings, and designations before finalising.

const leadership = [
  {
    title: "Visionaries",
    people: [
      { name: "Prof.(Dr.) Hemlata K. Bagla", role: "Hon. Vice Chancellor", emoji: "🎓" },
      { name: "Prof.(Dr.) Tejashree Shanbhag", role: "I/C Principal", emoji: "🏫" },
    ],
  },
  {
    title: "Vice Principals",
    people: [
      { name: "Dr. Shalini Sinha", role: "Vice Principal", emoji: "👩‍🏫" },
      { name: "Dr. Rajesh Ashok Samant", role: "Vice Principal", emoji: "👨‍🏫" },
      { name: "Dr. Ritika Pathak", role: "Vice Principal", emoji: "👩‍🏫" },
    ],
  },
  {
    title: "Department Head",
    people: [
      { name: "Dr. S. B. Muley", role: "Coordinator - CS Dept", emoji: "👨‍💻" },
    ],
  },
  {
    title: "Faculty Advisors",
    people: [
      { name: "Ms. Geeta Brijwani", role: "Faculty Advisor", emoji: "👩‍🏫" },
      { name: "Ms. Beena Karutharan", role: "Faculty Advisor", emoji: "👩‍🏫" },
      { name: "Ms. Jovairia Ansari", role: "Faculty Advisor", emoji: "👩‍🏫" },
      { name: "Ms. Ritika Sharma", role: "Faculty Advisor", emoji: "👩‍🏫" },
      { name: "Ms. Shalini Maheshgauri", role: "Faculty Advisor", emoji: "👩‍🏫" },
      { name: "Ms. Dhanashree Ingle", role: "Faculty Advisor", emoji: "👩‍🏫" },
    ],
  },
  {
    title: "Student Core Team",
    people: [

      // Replace the placeholder names with the actual core members' names.
      // Add a short description of what each member is responsible for if possible.
      
      { name: "Core 1", role: "Core Member", emoji: "🦁" },
      { name: "Core 2", role: "Core Member", emoji: "🐯" },
      { name: "Core 3", role: "Core Member", emoji: "🦅" },
      { name: "Core 4", role: "Core Member", emoji: "🐺" },
    ],
  },
];

// Update the department names, descriptions, and respective HOD details only if there are any official changes.

const departments: Department[] = [

  // Replace HOD 1 and HOD 2 with the respective names.
  // Keep HOD 1 as Head and HOD 2 as Co-Head.

  {
    name: "Accounts",
    icon: "💰",
    description: "Managing income, expenses, and maintaining financial transparency for the fest.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },
  {
    name: "Website",
    icon: "🌐",
    description: "Building, designing, and maintaining the official Fiestron website.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },
  {
    name: "Admin",
    icon: "📂",
    description: "Handling permissions, venue allocation, contracts, and official documentation.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },
  {
    name: "Coverage",
    icon: "📸",
    description: "Capturing photos, videos, highlights, and managing media coverage for events.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },
  {
    name: "Decor",
    icon: "✨",
    description: "Designing immersive decorations matching event themes and managing creative resources.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },
  {
    name: "Design",
    icon: "🎨",
    description: "Creating brochures, flyers, social media posts, and defining the visual theme.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },
  {
    name: "Logistics",
    icon: "🚚",
    description: "Handling on-ground requirements, equipment, and coordinating resource needs.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },
  {
    name: "Hospitality",
    icon: "🤝",
    description: "Welcoming guests, managing seating, refreshments, and ensuring comfort.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },
  {
    name: "Marketing",
    icon: "📢",
    description: "Promoting the club, managing campaigns, and building sponsor relationships.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },
  {
    name: "Security",
    icon: "🛡️",
    description: "Crowd management, access control, safety, and emergency response.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },
  {
    name: "Technical",
    icon: "💻",
    description: "Handling sound, lights, stage setup, and providing technical support.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },
  {
    name: "Public Relations",
    icon: "🔗",
    description: "Building connections, driving campaigns, and strengthening sponsor ties.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },
];


// Please don't modify anything below this point.
// All required content updates should be made in the data above.
// Only make changes to the components below if absolutely necessary for card sizing or minor visual improvements.

function PhotoPlaceholder({ name }: { name: string }) {
  return (
    <div
      className="team-photo"
      role="img"
      aria-label={`Photo placeholder for ${name}`}
    >
      <span>PHOTO</span>
    </div>
  );
}

function PersonCard({ person }: { person: Person }) {
  return (
    <article className="team-person-card">
      <PhotoPlaceholder name={person.name} />

      <div className="min-w-0">
        <h3 className="team-person-name">
          {person.emoji && <span>{person.emoji} </span>}
          {person.name}
        </h3>

        <p className="team-person-role">{person.role}</p>
      </div>
    </article>
  );
}

function LeadershipGroup({
  title,
  people,
}: {
  title: string;
  people: Person[];
}) {
  return (
    <div className="mb-16">
      <div className="team-group-heading">
        <span />
        <h3>{title}</h3>
        <span />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((person) => (
          <PersonCard key={person.name} person={person} />
        ))}
      </div>
    </div>
  );
}

function DepartmentCard({ department }: { department: Department }) {
  return (
    <article className="team-department-card">
      <div className="mb-5 flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">
          {department.icon}
        </span>

        <h3 className="font-['Orbitron'] text-base font-bold tracking-wider text-white">
          {department.name}
        </h3>
      </div>

      <div className="team-department-people">
        {department.people.map((person) => (
          <div className="team-department-member" key={person.name}>
            <PhotoPlaceholder name={person.name} />

            <div className="min-w-0">
              <h4 className="team-person-name">{person.name}</h4>
              <p className="team-person-role">{person.role}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="team-department-description">
        {department.description}
      </p>
    </article>
  );
}

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;

    if (!section || !canvas) return;

    return initAbout(section, canvas);
  }, []);

  return (
    <section
      id="team"
      ref={sectionRef}
      className="relative isolate w-full overflow-hidden bg-[radial-gradient(circle_at_80%_20%,rgba(157,78,221,0.15),transparent_45%),radial-gradient(circle_at_20%_80%,rgba(255,46,147,0.12),transparent_50%),#080609] px-6 py-24 sm:px-10"
    >
      {/* Moving particles */}
      <canvas
        ref={canvasRef}
        className="team-particles pointer-events-none absolute inset-0 z-0 h-full w-full"
        aria-hidden="true"
      />

      {/* Subtle blur layer over the background */}
      <div
        className="
          pointer-events-none absolute inset-0 z-[1]
          bg-[#080609]/20
          backdrop-blur-[2px]
        "
        aria-hidden="true"
      />

      {/* Section content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">

        {/* Header */}
        <header className="mb-20 text-center">
          <p className="mb-4 flex items-center justify-center gap-4 text-[0.7rem] font-semibold tracking-[0.35em] text-[#A99AA5]">
            <span className="h-px w-9 bg-[#FF2E93]/70" />
            THE CORE
            <span className="h-px w-9 bg-[#FF2E93]/70" />
          </p>

          <h2 className="font-['Orbitron'] text-[clamp(1.8rem,4vw,3rem)] font-black tracking-[0.08em] text-white drop-shadow-[0_0_18px_rgba(255,46,147,0.2)]">
            MINDS BEHIND FIESTRON
          </h2>

          <p className="mx-auto mt-5 max-w-[580px] text-sm font-light leading-[1.9] text-[#A99AA5] sm:text-base">
            Driven by a team of educators and students who bring structure,
            creativity, and technical expertise together.
          </p>
        </header>

        {/* Leadership groups */}
        {leadership.map((group) => (
          <LeadershipGroup
            key={group.title}
            title={group.title}
            people={group.people}
          />
        ))}

        {/* Department leads */}
        <div className="mt-24">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[0.65rem] font-semibold tracking-[0.35em] text-[#FF2E93]">
              THE FORCE BEHIND THE FEST
            </p>

            <h2 className="font-['Orbitron'] text-2xl font-bold tracking-[0.1em] text-white sm:text-3xl">
              DEPARTMENT LEADS
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#A99AA5]">
              The people turning ideas into experiences, one department at a time.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {departments.map((department) => (
              <DepartmentCard
                key={department.name}
                department={department}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}