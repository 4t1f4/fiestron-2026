import { useEffect, useRef } from "react";

import {
  UserRound,
  GraduationCap,
  Building2,
  Users,
  Crown,
  Wallet,
  Globe,
  FolderKanban,
  Camera,
  Sparkles,
  Palette,
  Truck,
  Handshake,
  Megaphone,
  ShieldCheck,
  Cpu,
  Network,
  type LucideIcon,
} from "lucide-react";

import { initAbout } from "../../sections/About/about";

import "./council.css";

type Person = {
  name: string;
  role: string;
};

type Department = {
  name: string;
  icon: LucideIcon;
  description: string;
  people: Person[];
};

type LeadershipGroup = {
  title: string;
  icon: LucideIcon;
  size: "visionary" | "senior" | "coordinator" | "standard";
  people: Person[];
};

// --------------------------------------------------
// LEADERSHIP
// --------------------------------------------------

const leadership: LeadershipGroup[] = [
  {
    title: "Visionaries",
    icon: Crown,
    size: "visionary",
    people: [
      {
        name: "Prof.(Dr.) Hemlata K. Bagla",
        role: "Hon. Vice Chancellor",
      },
      {
        name: "Prof.(Dr.) Tejashree Shanbhag",
        role: "I/C Principal",
      },
    ],
  },

  {
    title: "Vice Principals",
    icon: GraduationCap,
    size: "senior",
    people: [
      {
        name: "Dr. Shalini Sinha",
        role: "Vice Principal",
      },
      {
        name: "Dr. Rajesh Ashok Samant",
        role: "Vice Principal",
      },
      {
        name: "Dr. Ritika Pathak",
        role: "Vice Principal",
      },
    ],
  },

  {
    title: "Department Head",
    icon: Building2,
    size: "coordinator",
    people: [
      {
        name: "Dr. S. B. Muley",
        role: "Coordinator - CS Dept",
      },
    ],
  },

  {
    title: "Faculty Advisors",
    icon: Users,
    size: "standard",
    people: [
      {
        name: "Ms. Geeta Brijwani",
        role: "Faculty Advisor",
      },
      {
        name: "Ms. Beena Karutharan",
        role: "Faculty Advisor",
      },
      {
        name: "Ms. Jovairia Ansari",
        role: "Faculty Advisor",
      },
      {
        name: "Ms. Ritika Sharma",
        role: "Faculty Advisor",
      },
      {
        name: "Ms. Shalini Maheshgauri",
        role: "Faculty Advisor",
      },
      {
        name: "Ms. Dhanashree Ingle",
        role: "Faculty Advisor",
      },
    ],
  },

  {
    title: "Student Core Team",
    icon: Users,
    size: "standard",
    people: [
      { name: "Core 1", role: "Core Member" },
      { name: "Core 2", role: "Core Member" },
      { name: "Core 3", role: "Core Member" },
      { name: "Core 4", role: "Core Member" },
    ],
  },
];

// --------------------------------------------------
// DEPARTMENTS
// --------------------------------------------------

const departments: Department[] = [
  {
    name: "Accounts",
    icon: Wallet,
    description:
      "Managing income, expenses, and maintaining financial transparency for the fest.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },

  {
    name: "Website",
    icon: Globe,
    description:
      "Building, designing, and maintaining the official Fiestron website.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },

  {
    name: "Admin",
    icon: FolderKanban,
    description:
      "Handling permissions, venue allocation, contracts, and official documentation.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },

  {
    name: "Coverage",
    icon: Camera,
    description:
      "Capturing photos, videos, highlights, and managing media coverage for events.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },

  {
    name: "Decor",
    icon: Sparkles,
    description:
      "Designing immersive decorations matching event themes and managing creative resources.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },

  {
    name: "Design",
    icon: Palette,
    description:
      "Creating brochures, flyers, social media posts, and defining the visual theme.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },

  {
    name: "Logistics",
    icon: Truck,
    description:
      "Handling on-ground requirements, equipment, and coordinating resource needs.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },

  {
    name: "Hospitality",
    icon: Handshake,
    description:
      "Welcoming guests, managing seating, refreshments, and ensuring comfort.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },

  {
    name: "Marketing",
    icon: Megaphone,
    description:
      "Promoting the club, managing campaigns, and building sponsor relationships.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },

  {
    name: "Security",
    icon: ShieldCheck,
    description:
      "Crowd management, access control, safety, and emergency response.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },

  {
    name: "Technical",
    icon: Cpu,
    description:
      "Handling sound, lights, stage setup, and providing technical support.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },

  {
    name: "Public Relations",
    icon: Network,
    description:
      "Building connections, driving campaigns, and strengthening sponsor ties.",
    people: [
      { name: "HOD 1", role: "Head" },
      { name: "HOD 2", role: "Co-Head" },
    ],
  },
];

// --------------------------------------------------
// PORTRAIT PLACEHOLDER
// --------------------------------------------------

function PhotoPlaceholder({ name }: { name: string }) {
  return (
    <div
      className="team-photo"
      role="img"
      aria-label={`Portrait placeholder for ${name}`}
    >
      <div className="team-photo-inner">
        <UserRound aria-hidden="true" />
        <span>PORTRAIT</span>
      </div>
    </div>
  );
}

// --------------------------------------------------
// PERSON CARD
// --------------------------------------------------

function PersonCard({
  person,
  size,
}: {
  person: Person;
  size: LeadershipGroup["size"];
}) {
  return (
    <article className={`team-person-card team-person-card--${size}`}>
      <PhotoPlaceholder name={person.name} />

      <div className="min-w-0">
        <h3 className="team-person-name">{person.name}</h3>
        <p className="team-person-role">{person.role}</p>
      </div>
    </article>
  );
}

// --------------------------------------------------
// LEADERSHIP GROUP
// --------------------------------------------------

function LeadershipGroupSection({
  group,
}: {
  group: LeadershipGroup;
}) {
  const Icon = group.icon;

  return (
    <div className={`team-leadership-group team-group--${group.size}`}>
      <div className="team-group-heading">
        <span className="team-group-line" />

        <div className="team-group-title">
          <Icon aria-hidden="true" />
          <h3>{group.title}</h3>
        </div>

        <span className="team-group-line" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {group.people.map((person) => (
          <PersonCard
            key={person.name}
            person={person}
            size={group.size}
          />
        ))}
      </div>
    </div>
  );
}

// --------------------------------------------------
// DEPARTMENT CARD
// --------------------------------------------------

function DepartmentCard({
  department,
}: {
  department: Department;
}) {
  const Icon = department.icon;

  return (
    <article className="team-department-card">
      <div className="team-department-heading">
        <div className="team-department-icon">
          <Icon aria-hidden="true" />
        </div>

        <h3>{department.name}</h3>
      </div>

      <div className="team-department-people">
        {department.people.map((person) => (
          <div
            className="team-department-member"
            key={person.name}
          >
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

// --------------------------------------------------
// COUNCIL PAGE
// --------------------------------------------------

export default function Council() {
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
      id="council"
      ref={sectionRef}
      className="team-section relative isolate w-full overflow-hidden px-6 py-24 sm:px-10"
    >
      {/* Background particles */}
      <canvas
        ref={canvasRef}
        className="team-particles pointer-events-none absolute inset-0 z-0 h-full w-full"
        aria-hidden="true"
      />

      {/* Background blur */}
      <div
        className="team-background-overlay pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl">

        {/* Header */}
        <header className="team-header mb-20 text-center">
          <p className="team-eyebrow">
            <span />
            THE COUNCIL
            <span />
          </p>

          <h2 className="team-main-title">
            MINDS BEHIND FIESTRON
          </h2>

          <p className="team-intro">
            Meet the educators and student leaders shaping the vision,
            coordinating the teams, and bringing Fiestron to life.
          </p>
        </header>

        {/* Leadership */}
        <div className="team-leadership">
          {leadership.map((group) => (
            <LeadershipGroupSection
              key={group.title}
              group={group}
            />
          ))}
        </div>

        {/* Department leadership */}
        <div className="team-departments">
          <div className="team-departments-header">
            <p className="team-eyebrow">
              THE PEOPLE BEHIND THE EXECUTION
            </p>

            <h2>DEPARTMENT LEADERSHIP</h2>

            <p>
              Meet the teams responsible for transforming ideas
              into a seamless fest experience.
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