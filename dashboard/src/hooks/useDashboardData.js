import { useCallback, useEffect, useRef, useState } from "react";
import {
  incidentsByCity,
  incidentsOverTimeDaily,
  incidentsOverTimeMonthly,
  kpis,
  severityBreakdown,
  hotspots,
} from "../data/mockDashboardData";

import {
  fetchDashboardSummary,
  fetchIncidentsByCity,
  fetchIncidentsByCause,
  fetchIncidentsByHour,
  fetchIncidentsBySeverity,
  fetchIncidentsByWeather,
  fetchIncidentHotspots,
  fetchIncidentCities,
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
    major: "var(--color-chart-1)",
    // Backward compat if API returns older label "Serious"
    serious: "var(--color-chart-1)",
    unknown: "var(--color-chart-2)",
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

function mapHotspots(payload) {
  const rows = asArray(payload);
  const cleaned = rows
    .map((r, idx) => {
      const lat = asNumber(r.lat ?? r.latitude);
      const lng = asNumber(r.lng ?? r.longitude);
      if (lat == null || lng == null) return null;
      const count = asNumber(r.incident_count ?? r.count ?? r.value) ?? 0;
      const city = String(r.city ?? "").trim();
      const road = String(r.road_name ?? r.roadName ?? "").trim();
      const baseLabel = city && road ? `${city} • ${road}` : city || road || "Unknown";
      return {
        id: r.id ?? `${lat},${lng},${idx}`,
        baseLabel,
        label: `${baseLabel} (${Number(count || 0).toLocaleString()})`,
        lat,
        lng,
        count,
      };
    })
    .filter(Boolean);

  const max = cleaned.reduce((m, p) => Math.max(m, p.count || 0), 0);
  return cleaned.map((p) => ({
    id: p.id,
    baseLabel: p.baseLabel,
    label: p.label,
    lat: p.lat,
    lng: p.lng,
    count: p.count,
    intensity: max > 0 ? (p.count || 0) / max : 0.2,
  }));
}

export function useDashboardData() {
  const [filters, setFilters] = useState({
    city: "all",
    severity: "all",
    weather: "all",
    dateRange: "January 1, 2025 — March 31, 2025",
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
    hotspots,
    cityOptions: [],
  });

  const lastRequestId = useRef(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchIncidentCities();
        if (cancelled) return;
        const list = Array.isArray(rows)
          ? rows
          : Array.isArray(rows?.value)
            ? rows.value
            : Array.isArray(rows?.data)
              ? rows.data
              : [];
        const cities = list
          .map((r) => String(r.city ?? "").trim())
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));
        setData((prev) => ({ ...prev, cityOptions: cities }));
      } catch {
        // Keep defaults if cities endpoint fails
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
          fetchIncidentHotspots(nextFilters),
        ]);

        if (requestId !== lastRequestId.current) return;

        const [
          summaryRes,
          byCityRes,
          bySeverityRes,
          byWeatherRes,
          byCauseRes,
          byHourRes,
          hotspotsRes,
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
          if (hotspotsRes.status === "fulfilled") {
            const mapped = mapHotspots(hotspotsRes.value);
            next.hotspots = mapped.length ? mapped : prev.hotspots;
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

