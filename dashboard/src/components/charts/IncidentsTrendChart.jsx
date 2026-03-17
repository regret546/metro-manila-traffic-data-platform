import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { EllipsisIcon } from "../ui/Icons";

export default function IncidentsTrendChart({ title = "Incidents Over Time", data, timeMode, setTimeMode }) {
  const showToggle = typeof setTimeMode === "function" && typeof timeMode === "string";
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center gap-2">
          {showToggle ? (
            <div className="rounded-lg border border-border bg-base p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setTimeMode("monthly")}
                className={[
                  "rounded-md px-3 py-1 text-sm",
                  timeMode === "monthly" ? "bg-fg/5 text-fg" : "text-fg/60 hover:text-fg",
                ].join(" ")}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setTimeMode("daily")}
                className={[
                  "rounded-md px-3 py-1 text-sm",
                  timeMode === "daily" ? "bg-fg/5 text-fg" : "text-fg/60 hover:text-fg",
                ].join(" ")}
              >
                Daily
              </button>
            </div>
          ) : null}
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-base text-fg/70 shadow-sm hover:bg-fg/5"
            aria-label="More"
          >
            <EllipsisIcon />
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="h-[230px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 12, right: 16, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="incidentsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(15,23,42,0.06)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(15,23,42,0.55)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(15,23,42,0.55)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid rgba(15,23,42,0.10)",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
                }}
                labelStyle={{ color: "rgba(15,23,42,0.7)" }}
              />
              <Area
                type="monotone"
                dataKey="incidents"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fill="url(#incidentsFill)"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

