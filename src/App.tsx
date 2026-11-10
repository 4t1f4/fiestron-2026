import { BrowserRouter, Routes, Route } from "react-router-dom";


import Navbar from "./components/Navbar/Navbar";
import CustomCursor from "./components/CustomCursor/CustomCursor";

import Hero from "./sections/Hero/Hero.tsx";
import About from "./sections/About/About.tsx";

import TimelineBackground from "./sections/Timeline/TimelineBackground";

import Council from "./pages/Council/Council";

function Home() {
  return (
    <>
      <CustomCursor />

      <Navbar />

      <main>
        <Hero />
        <About />
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


export default function App() {
  return(
    <BrowserRouter>
      <CustomCursor />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/council" element={<Council />} />
      </Routes>

    
    </BrowserRouter>
  );
}