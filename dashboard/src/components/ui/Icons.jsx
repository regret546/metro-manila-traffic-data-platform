import React from "react";

function IconWrap({ className = "", children }) {
  return (
    <div
      className={[
        "grid h-10 w-10 place-items-center rounded-lg border",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function KpiIcon({ tone = "blue" }) {
  const toneMap = {
    blue: "border-primary/20 bg-primary/10 text-primary",
    amber: "border-[color:var(--color-accent-yellow)]/25 bg-[color:var(--color-accent-yellow)]/10 text-[color:var(--color-accent-yellow)]",
    green: "border-[color:var(--color-accent-green)]/25 bg-[color:var(--color-accent-green)]/10 text-[color:var(--color-accent-green)]",
    indigo: "border-[color:var(--color-accent-purple)]/25 bg-[color:var(--color-accent-purple)]/10 text-[color:var(--color-accent-purple)]",
  };

  return (
    <IconWrap className={toneMap[tone] ?? toneMap.blue}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="opacity-90"
      >
        <path
          d="M4 19V5m0 14h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M7 15l3-3 3 2 5-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconWrap>
  );
}

export function EllipsisIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 12h.01M12 12h.01M18 12h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

