import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

export default function CityBarChart({ title = "Incidents by City", data }) {
  const cleaned = Array.isArray(data) ? data : [];

  // Aggregate by city to avoid duplicated categories rendering as overlapping bars.
  // (Some APIs return multiple rows per city depending on joins/filters.)
  const byCity = new Map();
  for (const d of cleaned) {
    const cityRaw = d?.city ?? d?.name ?? d?.label ?? "";
    const cityDisplay = String(cityRaw).trim() || "Unknown";
    const cityKey = cityDisplay.toLowerCase();

    const value = typeof d?.value === "number" ? d.value : Number(d?.value ?? d?.incident_count ?? 0);
    const v = Number.isFinite(value) ? value : 0;
    if (v <= 0) continue;

    const prev = byCity.get(cityKey);
    if (prev) {
      prev.value += v;
    } else {
      byCity.set(cityKey, { city: cityDisplay, value: v });
    }
  }

  const normalized = Array.from(byCity.values());

  normalized.sort((a, b) => b.value - a.value);

  const TOP_N = 14;
  const top = normalized.slice(0, TOP_N);
  const rest = normalized.slice(TOP_N);
  const othersValue = rest.reduce((acc, d) => acc + (d.value || 0), 0);

  const chartData = othersValue > 0 ? [...top, { city: "Others", value: othersValue }] : top;

  const maxValue = chartData.reduce((m, d) => Math.max(m, d.value || 0), 0);
  const xMax = maxValue > 0 ? Math.ceil(maxValue * 1.12) : undefined;

  const truncate = (s, max = 14) => {
    const str = String(s ?? "");
    return str.length > max ? `${str.slice(0, max - 1)}…` : str;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[320px] lg:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              barCategoryGap={10}
              margin={{ left: 6, right: 26, top: 4, bottom: 2 }}
            >
              <CartesianGrid stroke="rgba(15,23,42,0.06)" horizontal={false} />
              <XAxis
                type="number"
                domain={xMax ? [0, xMax] : undefined}
                tick={{ fill: "rgba(15,23,42,0.55)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="city"
                width={132}
                tick={{ fill: "rgba(15,23,42,0.70)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                interval={0}
                minTickGap={0}
                tickMargin={8}
                tickFormatter={(v) => truncate(v, 16)}
              />
              <Tooltip
                cursor={{ fill: "rgba(15,23,42,0.04)" }}
                formatter={(value) => [Number(value).toLocaleString(), "Incidents"]}
                labelFormatter={(label) => `City: ${label}`}
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid rgba(15,23,42,0.10)",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
                }}
              />
              <Bar
                dataKey="value"
                radius={[999, 999, 999, 999]}
                fill="var(--color-chart-1)"
                barSize={14}
                isAnimationActive={false}
              >
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(v) => Number(v).toLocaleString()}
                  fill="rgba(15,23,42,0.60)"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

