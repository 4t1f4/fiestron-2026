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
    <main>
      <Hero />
      <About />
      <Timeline />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      
      <Routes>
        <Route path="/" element={<Intro />} />

        <Route
          path="/home"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        <Route
          path="/council"
          element={
            <>
              <Navbar />
              <Council />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}