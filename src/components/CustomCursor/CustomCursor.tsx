import { useEffect, useRef } from "react";
import "./cursor.css";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) return;

    // Only enable on devices with a proper mouse pointer
    const mediaQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    if (!mediaQuery.matches) return;

    document.documentElement.classList.add("custom-cursor-active");

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType === "touch") return;

      cursor!.style.transform =
        `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;

      cursor!.style.opacity = "1";
    }

    function handlePointerLeave() {
      cursor!.style.opacity = "0";
    }

    function handlePointerEnter() {
      cursor!.style.opacity = "1";
    }

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("pointerenter", handlePointerEnter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");

      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("pointerenter", handlePointerEnter);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      aria-hidden="true"
    />
  );
}