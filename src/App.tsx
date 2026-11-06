import { Navbar } from "./components/Navbar/Navbar";
import CustomCursor from "./components/CustomCursor/CustomCursor";

import Hero from "./sections/Hero/Hero.tsx";
import About from "./sections/About/About.tsx";

export default function App() {
  return (
    <>
      <CustomCursor />

      <Navbar />

      <main>
        <Hero />
        <About />

        {/* Add remaining sections here */}
      </main>
    </>
  );
}