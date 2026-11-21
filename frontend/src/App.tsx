import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Intro
import Intro from "./components/Intro/Intro.tsx";

// Global components
import CustomCursor from "./components/CustomCursor/CustomCursor.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.tsx";
import Footer from "./components/Footer/Footer.tsx";
import Chatbot from "./components/Chatbot/Chatbot.tsx";

// Backgrounds
import EventsTimelineBackground from "./components/Backgrounds/EventsTimelineBackground.tsx";

// Home sections
import Hero from "./sections/Hero/Hero.tsx";
import About from "./sections/About/About.tsx";
import Events from "./sections/Events/Events.tsx";
import Timeline from "./sections/Timeline/Timeline.tsx";
import Faq from "./sections/Faq/Faq.tsx";

// Pages
import Council from "./pages/Council/Council.tsx";
import Message from "./pages/Message/Message.tsx";

function Home() {
  return (
    <main>
      <Hero />
      <About />

      {/* The same shared background continues behind these sections */}
      <div className="events-timeline-wrapper">
        <EventsTimelineBackground />

        <div className="events-timeline-content">
          <Events />
          <Timeline />
          <Faq />
        </div>
      </div>
    </main>
  );
}

// Keep the chatbot away from the intro tunnel and dedicated message page.
function GlobalChatbot() {
  const location = useLocation();

  if (location.pathname === "/" || location.pathname === "/message") {
    return null;
  }

  return <Chatbot />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CustomCursor />
      <GlobalChatbot />

      <Routes>

        {/* Intro tunnel */}
        <Route path="/" element={<Intro />} />

        {/* Main website */}
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

        {/* Council page */}
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

        {/* Standalone contact page: no Navbar or Footer */}
        <Route
          path="/message"
          element={<Message />}
        />

      </Routes>
    </BrowserRouter>
  );
}