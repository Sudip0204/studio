import type { SVGProps } from "react";

export const EcoCityLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 10a4.3 4.3 0 0 0-4 5c0 1.5 1.5 4 4 4s4-2.5 4-4c0-2.8-2-5-4-5z" />
    <path d="M12 7v3" />
  </svg>
);
