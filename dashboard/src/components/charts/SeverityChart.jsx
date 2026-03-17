import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { formatCompact } from "../../utils/formatNumber";

export default function SeverityChart({ title = "Severity Breakdown", data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-3">
          {data.map((s) => (
            <div key={s.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-fg/70 tracking-normal">{s.name}</span>
                <span className="text-fg/60 tracking-normal">{formatCompact(s.value)}</span>
              </div>
              <div className="h-2 rounded-full bg-fg/5">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${Math.max(8, Math.round((s.value / 3500) * 100))}%`,
                    background: s.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-fg/70 tracking-normal">Subject</span>
            <span className="text-fg/60 tracking-normal">51</span>
          </div>
          <div className="h-2 rounded-full bg-fg/5">
            <div
              className="h-2 rounded-full bg-[color:var(--color-accent-red)]/80"
              style={{ width: "22%" }}
            />
          </div>
          <div className="mt-2 text-xs text-fg/50 tracking-normal">3.12K</div>
        </div>
      </CardContent>
    </Card>
  );
}

