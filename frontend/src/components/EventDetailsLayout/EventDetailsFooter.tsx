import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function EventDetailsFooter() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#06040A] px-6 py-7 text-white sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/home#events"
          className="group inline-flex items-center gap-2.5 font-['IBM_Plex_Mono',monospace] text-xs font-medium tracking-[0.2em] text-[#9E96B0] no-underline transition-colors duration-200 hover:text-[#D9B8FF]"
        >
          <ArrowLeft
            size={14}
            className="text-[#AF69FF] transition-transform duration-200 group-hover:-translate-x-1"
          />
          DISCOVER MORE EVENTS
        </Link>

        <p className="m-0 font-['IBM_Plex_Mono',monospace] text-[9px] tracking-[0.2em] text-[#6E647D]">
          © 2026 TECH CLUB · FIESTRON 2026
        </p>
      </div>
    </footer>
  );
}