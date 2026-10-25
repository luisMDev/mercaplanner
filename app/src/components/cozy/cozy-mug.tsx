import type { ComponentProps } from "react";

// Hand-drawn steaming mug with a heart, in the ink style of the tomato logo:
// the drawing of a day off
export function CozyMug(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" {...props}>
      {/* Steam */}
      <g fill="none" stroke="var(--faint)" strokeWidth="2.2" strokeLinecap="round" className="animate-steam">
        <path d="M34 26c-4-5 4-8 0-14" />
        <path d="M46 24c-4-5 4-8 0-14" />
        <path d="M58 26c-4-5 4-8 0-14" />
      </g>
      {/* Saucer */}
      <ellipse cx="46" cy="80" rx="34" ry="7" fill="var(--teal-soft)" stroke="var(--ink)" strokeWidth="2" />
      {/* Handle */}
      <path d="M70 44c11 0 13 18 0 20" fill="none" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
      <path d="M70 44c11 0 13 18 0 20" fill="none" stroke="var(--gold-soft)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Body */}
      <path
        d="M20 34h52v26c0 11-10 18-26 18S20 71 20 60Z"
        fill="var(--gold-soft)"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Coffee at the rim */}
      <ellipse cx="46" cy="34" rx="26" ry="5" fill="var(--clay)" stroke="var(--ink)" strokeWidth="2" />
      {/* Highlight */}
      <path d="M27 42v16" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="3" strokeLinecap="round" />
      {/* Heart */}
      <path
        d="M46 64c-7-4.6-9.5-8-9.5-11a4.6 4.6 0 0 1 9.5-1.6 4.6 4.6 0 0 1 9.5 1.6c0 3-2.5 6.4-9.5 11Z"
        fill="var(--tomato)"
        stroke="var(--ink)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
