import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

export default function VehiclePieChart({ title = "Vehicle Type Distribution", data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[210px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={78}
                paddingAngle={2}
              >
                {data.map((s) => (
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
        </div>
        <div className="-mt-[138px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-semibold tracking-normal">{data?.[0]?.value ?? 0}%</div>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-fg/70">
          {data.map((s) => (
            <div key={s.name} className="inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: s.color }} />
              <span className="tracking-normal">{s.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

