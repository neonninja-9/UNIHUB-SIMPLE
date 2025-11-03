import React from "react";

export const FlipIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-rotate-cw"
  >
    <path d="M21 2v6h-6" />
    <path d="M21 13a9 9 0 1 1-3-7.7L21 8" />
  </svg>
);

export const UniversityLogoIcon: React.FC = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="University Logo"
  >
    <path
      d="M12 2L4 5v6c0 5.55 3.58 10.4 8 11.45c4.42-1.05 8-5.9 8-11.45V5l-8-3zm1.91 9.09c-.31.31-.73.49-1.18.49s-.87-.18-1.18-.49c-.64-.64-.76-1.63-.33-2.42l1.51-2.78l1.51 2.78c.43.79.31 1.78-.33 2.42z"
      fill="#0f2e5f"
    />
    <path
      d="M12.73 6.94L11.22 4.16L9.71 6.94c-.43.79-.31 1.78.33 2.42c.31.31.73.49 1.18.49s.87-.18 1.18-.49c.64-.64.76-1.63.33-2.42z"
      fill="#eab308"
    />
  </svg>
);

export const PrintIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect width="12" height="8" x="6" y="14" />
  </svg>
);
