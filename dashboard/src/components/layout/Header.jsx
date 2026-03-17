import React from "react";

export default function Header({
  title = "Metro Manila Traffic Dashboard",
  subtitle = "Traffic incident analytics from ETL pipeline",
  right,
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <h1 className="text-fg text-[2rem] font-semibold tracking-normal">{title}</h1>
        <div className="mt-1 text-fg/60 tracking-normal">{subtitle}</div>
      </div>
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  );
}

