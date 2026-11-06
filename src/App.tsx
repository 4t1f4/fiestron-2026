import { Navbar } from "./components/Navbar/Navbar";
import CustomCursor from "./components/CustomCursor/CustomCursor";

import Hero from "./sections/Hero/Hero.tsx";
import About from "./sections/About/About.tsx";
import Team from "./sections/Team/Team.tsx";

export default function App() {
  return (
    <>
      <CustomCursor />

      <Navbar />

      <main>
        <Hero />
        <About />
        <Team />

        {/* Add remaining sections here */}
      </main>
    </>
  );
}