import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { formatCompact } from "../../utils/formatNumber";

export default function SeverityChart({ title = "Severity Breakdown", data }) {
  const maxValue = data.reduce((m, s) => {
    const v = typeof s?.value === "number" ? s.value : Number(s?.value ?? 0);
    return Number.isFinite(v) ? Math.max(m, v) : m;
  }, 0);

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
                    width: `${maxValue > 0 ? Math.max(2, Math.round(((s.value || 0) / maxValue) * 100)) : 0}%`,
                    background: s.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

