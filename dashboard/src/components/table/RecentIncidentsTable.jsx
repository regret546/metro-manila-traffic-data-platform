import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { formatCompact } from "../../utils/formatNumber";

export default function RecentIncidentsTable({ title = "Recent Incident Records", rows }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="overflow-auto scrollbar-thin">
          <table className="w-full border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-xs text-fg/50">
                <th className="px-2 py-1 font-semibold tracking-normal">Incident Id</th>
                <th className="px-2 py-1 font-semibold tracking-normal">Date</th>
                <th className="px-2 py-1 font-semibold tracking-normal">City</th>
                <th className="px-2 py-1 font-semibold tracking-normal">Road</th>
                <th className="px-2 py-1 font-semibold tracking-normal">Severity</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="bg-fg/3">
                  <td className="rounded-l-lg px-2 py-2 font-semibold tracking-normal text-fg/80">
                    {r.id}
                  </td>
                  <td className="px-2 py-2 text-fg/60 tracking-normal">{r.date}</td>
                  <td className="px-2 py-2 text-fg/70 tracking-normal">{r.city}</td>
                  <td className="px-2 py-2 text-fg/70 tracking-normal">{r.road}</td>
                  <td className="rounded-r-lg px-2 py-2 text-fg/70 tracking-normal">
                    {formatCompact(r.severity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 text-right">
          <button
            type="button"
            className="text-sm font-semibold tracking-normal text-primary hover:underline"
          >
            View Complete Report
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

