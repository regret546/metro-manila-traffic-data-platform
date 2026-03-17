import React from "react";
import { Card, CardContent } from "../ui/Card";
import { KpiIcon } from "../ui/Icons";

export default function SummaryCard({ title, value, tone = "blue" }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 pt-5">
        <div>
          <div className="text-sm text-fg/60 tracking-normal">{title}</div>
          <div className="mt-1 text-2xl font-semibold tracking-normal">{value}</div>
        </div>
        <KpiIcon tone={tone} />
      </CardContent>
    </Card>
  );
}

