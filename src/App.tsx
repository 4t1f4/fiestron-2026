import { Navbar } from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero.tsx";

function App() {
  return (
    <div className="min-h-screen bg-[#080609] text-white">
      <Navbar />

      <main>
        <Hero />
      </main>
    </div>
  );
}

export default App;