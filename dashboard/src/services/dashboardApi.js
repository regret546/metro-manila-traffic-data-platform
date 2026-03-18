import { api } from "./api";

function incidentsPrefix() {
  const baseURL = String(import.meta.env.VITE_API_BASE_URL ?? "");
  // If baseURL already points at /api/incidents, don't prepend it again.
  return baseURL.includes("/api/incidents") ? "" : "/api/incidents";
}

function incidentsUrl(path) {
  const prefix = incidentsPrefix();
  if (!prefix) return path.startsWith("/") ? path : `/${path}`;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${prefix}${p}`;
}

function buildParams(filters = {}) {
  const params = {};

  if (filters.city && filters.city !== "all") params.city = filters.city;
  if (filters.severity && filters.severity !== "all") params.severity = filters.severity;
  if (filters.weather && filters.weather !== "all") params.weather = filters.weather;

  // Accept "March 21, 2025 — March 22, 2026" (em dash) or "-" / "--" variants.
  if (filters.dateRange) {
    const parts = String(filters.dateRange)
      .split(/[—–-]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 2) {
      params.start_date = parts[0];
      params.end_date = parts[1];
    } else {
      params.date_range = filters.dateRange;
    }
  }

  return params;
}

export async function fetchDashboardSummary(filters) {
  const res = await api.get(incidentsUrl("/summary"), { params: buildParams(filters) });
  return res.data;
}

export async function fetchIncidentsByCity(filters) {
  const res = await api.get(incidentsUrl("/by-city"), { params: buildParams(filters) });
  return res.data;
}

export async function fetchIncidentsBySeverity(filters) {
  const res = await api.get(incidentsUrl("/by-severity"), { params: buildParams(filters) });
  return res.data;
}

export async function fetchIncidentsByWeather(filters) {
  const res = await api.get(incidentsUrl("/by-weather"), { params: buildParams(filters) });
  return res.data;
}

export async function fetchIncidentsByHour(filters) {
  const res = await api.get(incidentsUrl("/by-hour"), { params: buildParams(filters) });
  return res.data;
}

export async function fetchIncidentsByCause(filters) {
  const res = await api.get(incidentsUrl("/by-cause"), { params: buildParams(filters) });
  return res.data;
}

export async function fetchIncidentHotspots(filters) {
  const res = await api.get(incidentsUrl("/hotspots"), { params: buildParams(filters) });
  return res.data;
}

export async function fetchIncidentCities() {
  const res = await api.get(incidentsUrl("/cities"));
  return res.data;
}

