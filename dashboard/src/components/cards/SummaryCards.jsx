import React from "react";
import SummaryCard from "./SummaryCard";

export default function SummaryCards({ items }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {items.map((k) => (
        <SummaryCard key={k.id} title={k.label} value={k.value} tone={k.tone} />
      ))}
    </div>
  );
}

