import { BrowserRouter, Routes, Route } from "react-router-dom";

// Intro
import Intro from "./components/Intro/Intro";

// Global Components
import CustomCursor from "./components/CustomCursor/CustomCursor";
import Navbar from "./components/Navbar/Navbar";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Footer from "./components/Footer/Footer";

// Home Sections
import Hero from "./sections/Hero/Hero.tsx";
import About from "./sections/About/About.tsx";
// import Events from "./sections/Events/Events";
import Timeline from "./sections/Timeline/Timeline";

// Pages
import Council from "./pages/Council/Council";

function Home() {
  return (
    <main>
      <Hero />
      <About />
      {/* <Events /> */}
      <Timeline />
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <CustomCursor />

      <Routes>
        <Route path="/" element={<Intro />} />

        <Route
          path="/home"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />

        <Route
          path="/council"
          element={
            <>
              <Navbar />
              <Council />
              <Footer />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}