import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <header className="fixed top-5 left-0 w-full flex justify-center z-50 px-5">
      <nav className="flex items-center justify-between w-full max-w-5xl px-7 py-3 bg-[#180710]/75 backdrop-blur-md border border-[#FF2E93]/20 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        <a href="#top" className="font-['Orbitron'] font-bold text-lg tracking-[0.2em] text-white hover:text-[#FF2E93] transition-colors duration-300 drop-shadow-[0_0_10px_rgba(255,46,147,0.5)]">
          FIESTRON
        </a>

        <ul className="hidden md:flex items-center space-x-8">
          {['ABOUT', 'EVENTS', 'TIMELINE', 'GALLERY', 'CONTACT'].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="text-xs font-medium tracking-[0.2em] text-[#A99AA5] hover:text-[#FF2E93] hover:drop-shadow-[0_0_8px_rgba(255,46,147,0.6)] transition-all duration-300"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#register"
          className="text-xs font-semibold tracking-[0.2em] text-[#080609] bg-[#FF2E93] px-6 py-2.5 rounded-full hover:bg-white hover:shadow-[0_0_25px_rgba(255,46,147,0.8)] transition-all duration-300 shadow-[0_0_15px_rgba(255,46,147,0.4)]"
        >
          REGISTER
        </a>
      </nav>
    </header>
  );
};