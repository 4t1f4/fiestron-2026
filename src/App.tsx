import Navbar from "./components/Navbar/Navbar";
import CustomCursor from "./components/CustomCursor/CustomCursor";

import Hero from "./sections/Hero/Hero.tsx";
import About from "./sections/About/About.tsx";
import Team from "./sections/Team/Team";

import TimelineBackground from "./sections/Timeline/TimelineBackground";

export default function App() {
  return (
    <>
      <CustomCursor />

      <Navbar />

      <main>
        <Hero />
        <About />
        <Team />

        <section className="relative isolate min-h-screen overflow-hidden bg-[#080609]">

          <TimelineBackground />

          <div className="relative z-10 flex min-h-screen items-center justify-center">
            <h2 className="font-['Orbitron'] text-white/70">
              TIMELINE PREVIEW
            </h2>
          </div>

        </section>

        {/* Add remaining sections here */}
      </main>
    </>
  );
}