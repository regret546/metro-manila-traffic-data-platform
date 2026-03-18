import React, { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

function palette(i) {
  const colors = [
    "var(--color-chart-1)",
    "var(--color-chart-4)",
    "var(--color-chart-3)",
    "var(--color-chart-2)",
    "var(--color-chart-5)",
  ];
  return colors[i % colors.length];
}

export default function CausePieChart({ title = "Incidents by Cause", data }) {
  const computed = useMemo(() => {
    const rows = Array.isArray(data) ? data : [];
    const sum = rows.reduce((acc, r) => acc + (Number(r.value) || 0), 0);
    return rows.map((r, i) => ({
      ...r,
      percent: sum > 0 ? Math.round(((Number(r.value) || 0) / sum) * 100) : 0,
      color: r.color ?? palette(i),
    }));
  }, [data]);

  const centerPercent = computed[0]?.percent ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="relative h-[210px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={computed}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={78}
                paddingAngle={2}
                isAnimationActive={false}
              >
                {computed.map((s) => (
                  <Cell key={s.name} fill={s.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid rgba(15,23,42,0.10)",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-semibold tracking-normal">{centerPercent}%</div>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-fg/70">
          {computed.slice(0, 6).map((s) => (
            <div
              key={s.name}
              className="flex min-w-0 items-center gap-2"
              title={s.name}
            >
              <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
              <span className="min-w-0 truncate tracking-normal">{s.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

