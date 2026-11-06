import { Navbar } from "./components/Navbar/Navbar";
import Hero from "./sections/Hero/Hero.tsx";
import About from "./sections/About/About.tsx";

function App() {
  return (
    <div className="min-h-screen bg-[#080609] text-white">
      <Navbar />

      <main>
        <Hero />
        <About />
      </main>
    </div>
  );
}

export default App;