import { BrowserRouter, Routes, Route } from "react-router-dom";

// Intro
import Intro from "./components/Intro/Intro";

// Global Components
import CustomCursor from "./components/CustomCursor/CustomCursor";
import Navbar from "./components/Navbar/Navbar";

// Home Sections
import Hero from "./sections/Hero/Hero.tsx";
import About from "./sections/About/About.tsx";
import Timeline from "./sections/Timeline/Timeline";

// Pages
import Council from "./pages/Council/Council";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <About />
        <Timeline />
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* One cursor for the entire website */}
      <CustomCursor />

      <Routes>
        {/* Initial Tunnel Intro */}
        <Route path="/" element={<Intro />} />

        {/* Main Fiestron Website */}
        <Route path="/home" element={<Home />} />

        {/* Council Page */}
        <Route path="/council" element={<Council />} />
      </Routes>
    </BrowserRouter>
  );
}