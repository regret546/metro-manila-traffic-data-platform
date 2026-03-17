import { useCallback, useRef, useState } from "react";
import {
  incidentsByCity,
  incidentsOverTimeDaily,
  incidentsOverTimeMonthly,
  kpis,
  severityBreakdown,
} from "../data/mockDashboardData";

import {
  fetchDashboardSummary,
  fetchIncidentsByCity,
  fetchIncidentsByCause,
  fetchIncidentsByHour,
  fetchIncidentsBySeverity,
  fetchIncidentsByWeather,
} from "../services/dashboardApi";
import { formatCurrency } from "../utils/formatCurrency";

function asArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return [];
}

function asNumber(v) {
  const n = typeof v === "string" ? Number(v.replaceAll(",", "")) : Number(v);
  return Number.isFinite(n) ? n : null;
}

function mapSummaryToKpis(payload) {
  const s = payload?.data ?? payload ?? {};

  const totalIncidents =
    asNumber(s.total_incidents) ??
    asNumber(s.totalIncidents) ??
    asNumber(s.incidents) ??
    null;
  const totalInjuries =
    asNumber(s.total_injuries) ??
    asNumber(s.totalInjuries) ??
    asNumber(s.injuries) ??
    null;
  const totalDamage =
    asNumber(s.total_damage_cost) ??
    asNumber(s.totalDamageCost) ??
    asNumber(s.damage_cost) ??
    null;
  const avgDamage =
    asNumber(s.avg_damage_cost) ??
    asNumber(s.averageDamageCost) ??
    asNumber(s.avgDamageCost) ??
    null;

  return [
    {
      id: "incidents",
      label: "Total Incidents",
      value: totalIncidents == null ? "—" : totalIncidents.toLocaleString(),
      tone: "blue",
    },
    {
      id: "injuries",
      label: "Total Injuries",
      value: totalInjuries == null ? "—" : totalInjuries.toLocaleString(),
      tone: "amber",
    },
    {
      id: "damageTotal",
      label: "Total Damage Cost",
      value: totalDamage == null ? "—" : formatCurrency(totalDamage),
      tone: "green",
    },
    {
      id: "damageAvg",
      label: "Avg Damage Cost",
      value: avgDamage == null ? "—" : formatCurrency(avgDamage),
      tone: "indigo",
    },
  ];
}

function mapByCity(payload) {
  const rows = asArray(payload);
  return rows.map((r) => ({
    city: r.city ?? r.name ?? r.label ?? "Unknown",
    value:
      asNumber(r.incident_count) ??
      asNumber(r.value) ??
      asNumber(r.incidents) ??
      asNumber(r.count) ??
      asNumber(r.total) ??
      0,
  }));
}

function mapByWeather(payload) {
  const rows = asArray(payload);
  return rows.map((r) => ({
    label: r.weather_condition ?? r.weatherCondition ?? r.weather ?? r.name ?? "Unknown",
    value: asNumber(r.incident_count) ?? asNumber(r.count) ?? asNumber(r.value) ?? 0,
  }));
}

function mapBySeverity(payload) {
  const rows = asArray(payload);
  const paletteByKey = {
    minor: "var(--color-chart-3)",
    serious: "var(--color-chart-1)",
    fatal: "var(--color-chart-5)",
  };

  return rows.map((r) => {
    const name = r.severity ?? r.name ?? r.label ?? "Unknown";
    const key = String(name).toLowerCase();
    return {
      name,
      value:
        asNumber(r.incident_count) ??
        asNumber(r.value) ??
        asNumber(r.count) ??
        asNumber(r.incidents) ??
        0,
      color: paletteByKey[key] ?? "var(--color-chart-2)",
    };
  });
}

function mapByCause(payload) {
  const rows = asArray(payload);
  const mapped = rows.map((r) => ({
    name: r.cause ?? r.name ?? r.label ?? "Unknown",
    value: asNumber(r.incident_count) ?? asNumber(r.count) ?? asNumber(r.value) ?? 0,
  }));
  // Keep chart readable: take top 6 causes by count.
  mapped.sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  return mapped.slice(0, 6);
}

function mapByHour(payload) {
  const rows = asArray(payload);
  const mapped = rows
    .map((r) => {
      const hour =
        asNumber(r.hour) ??
        asNumber(r.hr) ??
        asNumber(r.hour_of_day) ??
        asNumber(r.hourOfDay);
      if (hour == null) return null;
      return {
        hour,
        name: `${String(hour).padStart(2, "0")}:00`,
        incidents: asNumber(r.incident_count) ?? asNumber(r.count) ?? asNumber(r.value) ?? 0,
      };
    })
    .filter(Boolean);
  mapped.sort((a, b) => a.hour - b.hour);
  return mapped;
}

export function useDashboardData() {
  const [filters, setFilters] = useState({
    city: "all",
    severity: "all",
    weather: "all",
    dateRange: "March 21, 2025 — March 22, 2026",
    days: "30",
  });

  const [timeMode, setTimeMode] = useState("monthly");

  const fallbackTimeSeries =
    timeMode === "daily" ? incidentsOverTimeDaily : incidentsOverTimeMonthly;

  const [status, setStatus] = useState({ loading: false, error: null });
  const [data, setData] = useState({
    kpis,
    timeSeries: fallbackTimeSeries,
    incidentsByCity,
    severityBreakdown,
    weatherBreakdown: [],
    causeBreakdown: [],
  });

  const lastRequestId = useRef(0);

  const refresh = useCallback(
    async (nextFilters = filters) => {
      const requestId = ++lastRequestId.current;
      setStatus({ loading: true, error: null });

      try {
        const results = await Promise.allSettled([
          fetchDashboardSummary(nextFilters),
          fetchIncidentsByCity(nextFilters),
          fetchIncidentsBySeverity(nextFilters),
          fetchIncidentsByWeather(nextFilters),
          fetchIncidentsByCause(nextFilters),
          fetchIncidentsByHour(nextFilters),
        ]);

        if (requestId !== lastRequestId.current) return;

        const [
          summaryRes,
          byCityRes,
          bySeverityRes,
          byWeatherRes,
          byCauseRes,
          byHourRes,
        ] = results;

        setData((prev) => {
          const next = { ...prev };

          if (summaryRes.status === "fulfilled") next.kpis = mapSummaryToKpis(summaryRes.value);
          if (byHourRes.status === "fulfilled") {
            const mapped = mapByHour(byHourRes.value);
            next.timeSeries = mapped.length ? mapped : prev.timeSeries;
          }
          if (byCityRes.status === "fulfilled") {
            const mapped = mapByCity(byCityRes.value);
            next.incidentsByCity = mapped.length ? mapped : prev.incidentsByCity;
          }
          if (bySeverityRes.status === "fulfilled") {
            const mapped = mapBySeverity(bySeverityRes.value);
            next.severityBreakdown = mapped.length ? mapped : prev.severityBreakdown;
          }
          if (byWeatherRes.status === "fulfilled") {
            const mapped = mapByWeather(byWeatherRes.value);
            next.weatherBreakdown = mapped.length ? mapped : prev.weatherBreakdown;
          }
          if (byCauseRes.status === "fulfilled") {
            const mapped = mapByCause(byCauseRes.value);
            next.causeBreakdown = mapped.length ? mapped : prev.causeBreakdown;
          }

          return next;
        });

        const rejectedCount = results.reduce(
          (acc, r) => acc + (r.status === "rejected" ? 1 : 0),
          0,
        );
        setStatus({
          loading: false,
          // Only show an error if *everything* failed (API likely unreachable).
          error:
            rejectedCount === results.length
              ? "API is unreachable (all requests failed). Check your backend and .env settings."
              : null,
        });
      } catch (e) {
        if (requestId !== lastRequestId.current) return;
        setStatus({ loading: false, error: e?.message ?? "Failed to load dashboard data." });
        setData((prev) => ({ ...prev, timeSeries: fallbackTimeSeries }));
      }
    },
    [filters, fallbackTimeSeries],
  );

  return {
    filters,
    setFilters,
    timeMode,
    setTimeMode,
    status,
    refresh,
    data,
  };
}

