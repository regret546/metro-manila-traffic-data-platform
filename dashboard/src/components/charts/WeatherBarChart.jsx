import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

export default function WeatherBarChart({ title = "Incidents by Weather", data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[210px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid stroke="rgba(15,23,42,0.06)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "rgba(15,23,42,0.55)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={110}
                tick={{ fill: "rgba(15,23,42,0.70)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid rgba(15,23,42,0.10)",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
                }}
              />
              <Bar
                dataKey="value"
                radius={[999, 999, 999, 999]}
                fill="var(--color-chart-2)"
                // Fixed bar thickness so a single category doesn't become a full-height block.
                barSize={22}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

