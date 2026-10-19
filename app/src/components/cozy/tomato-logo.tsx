import type { ComponentProps } from "react";

// Hand-drawn tomato: the app's logo and a little decoration here and there
export function TomatoLogo(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <path
        d="M24 12.5c-11.5 0-19.5 7.2-19.5 16.8C4.5 39 13.4 44 24 44s19.5-5 19.5-14.7c0-9.6-8-16.8-19.5-16.8Z"
        fill="var(--tomato)"
        stroke="var(--ink)"
        strokeWidth="2"
      />
      <path d="M12 26c1.4-4.6 5-7.6 9.6-8.4" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M27.1 8.8 26.4 13l7.6 1-7.6 1 .7 4.2-4-3.6-7.2 1.6 5.1-3.2-5.1-3.2 7.2 1.6Z"
        fill="var(--green)"
        stroke="var(--ink)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M24 13c0-3 .6-5.6 2.4-7.6" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
