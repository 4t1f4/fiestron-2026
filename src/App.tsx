import { BrowserRouter, Routes, Route } from "react-router-dom";


import Navbar from "./components/Navbar/Navbar";
import CustomCursor from "./components/CustomCursor/CustomCursor";

import Hero from "./sections/Hero/Hero.tsx";
import About from "./sections/About/About.tsx";

import Timeline from "./sections/Timeline/Timeline";

import Council from "./pages/Council/Council";

function Home() {
  return (
    <>
      <CustomCursor />

      <Navbar />

      <main>
        <Hero />
        <About />
        <Timeline />
  

        

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