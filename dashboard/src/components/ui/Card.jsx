import React from "react";

export function Card({ className = "", children }) {
  return (
    <div
      className={[
        "rounded-xl border border-border bg-base shadow-sm",
        "backdrop-blur-[1px]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }) {
  return (
    <div className={["px-5 pt-5", className].join(" ")}>{children}</div>
  );
}

export function CardTitle({ className = "", children }) {
  return (
    <div
      className={[
        "text-[0.95rem] font-semibold tracking-normal text-fg",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function CardSubtitle({ className = "", children }) {
  return (
    <div className={["mt-1 text-sm text-fg/60 tracking-normal", className].join(" ")}>
      {children}
    </div>
  );
}

export function CardContent({ className = "", children }) {
  return <div className={["px-5 pb-5", className].join(" ")}>{children}</div>;
}

