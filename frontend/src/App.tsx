import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Intro
import Intro from "./components/Intro/Intro.tsx";

// Global Components
import CustomCursor from "./components/CustomCursor/CustomCursor.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.tsx";
import Footer from "./components/Footer/Footer.tsx";
import Chatbot from "./components/Chatbot/Chatbot.tsx";

// Backgrounds
import EventsTimelineBackground from "./components/Backgrounds/EventsTimelineBackground.tsx";

// Home Sections
import Hero from "./sections/Hero/Hero.tsx";
import About from "./sections/About/About.tsx";
import Events from "./sections/Events/Events.tsx";
import Timeline from "./sections/Timeline/Timeline.tsx";

// Pages
import Council from "./pages/Council/Council.tsx";

function Home() {
  return (
    <main>
      <Hero />
      <About />

      {/* Shared Events + Timeline Background */}
      <div className="events-timeline-wrapper">
        <EventsTimelineBackground />

        <div className="events-timeline-content">
          <Events />
          <Timeline />
        </div>
      </div>
    </main>
  );
}

// Show chatbot everywhere except the Intro Tunnel.
function GlobalChatbot() {
  const location = useLocation();

  if (location.pathname === "/") return null;

  return <Chatbot />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CustomCursor />
      <GlobalChatbot />

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