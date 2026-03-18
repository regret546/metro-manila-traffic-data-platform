
function parseDateRangeParts(params) {
  if (params?.start_date && params?.end_date) {
    return { start_date: String(params.start_date).trim(), end_date: String(params.end_date).trim() };
  }

  const raw = params?.date_range;
  if (!raw) return null;

  // Examples: "March 21, 2025 — March 22, 2026"
  const parts = String(raw)
    .split(/[—–-]/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length === 2) {
    return { start_date: parts[0], end_date: parts[1] };
  }

  return null;
}

function buildIncidentWhere(params, values, { requireCoords = false } = {}) {
  const where = [];

  if (params?.city && params.city !== "all") {
    values.push(params.city);
    where.push(`LOWER(l.city) = LOWER($${values.length})`);
  }

  if (params?.severity && params.severity !== "all") {
    values.push(params.severity);
    where.push(`LOWER(s.severity) = LOWER($${values.length})`);
  }

  if (params?.weather && params.weather !== "all") {
    values.push(params.weather);
    where.push(`LOWER(w.weather_condition) = LOWER($${values.length})`);
  }

  const range = parseDateRangeParts(params || {});
  if (range?.start_date && range?.end_date) {
    values.push(range.start_date);
    const startIdx = values.length;
    values.push(range.end_date);
    const endIdx = values.length;

    // Example input format: "March 21, 2025"
    where.push(
      `d.full_date BETWEEN to_date($${startIdx}, 'FMMonth DD, YYYY') AND to_date($${endIdx}, 'FMMonth DD, YYYY')`,
    );
  } else if (params?.days) {
    const daysNum = Number(params.days);
    if (Number.isFinite(daysNum) && daysNum > 0) {
      values.push(daysNum);
      const daysIdx = values.length;
      where.push(`d.full_date >= (CURRENT_DATE - ($${daysIdx}::int))`);
    }
  }

  if (requireCoords) {
    where.push(`l.latitude IS NOT NULL AND l.longitude IS NOT NULL`);
  }

  return where.length ? `WHERE ${where.join(" AND ")}` : "";
}

function getIncidentsSummary(params = {}) {
  const values = [];
  const where = buildIncidentWhere(params, values);

  return {
    text: `
      SELECT
        COUNT(*) AS total_incidents,
        COALESCE(SUM(injury_count), 0) AS total_injuries,
        COALESCE(SUM(damage_cost_php), 0) AS total_damage_cost,
        ROUND(COALESCE(AVG(damage_cost_php), 0), 2) AS avg_damage_cost
      FROM fact_incidents f
      LEFT JOIN dim_location l ON f.location_id = l.location_id
      LEFT JOIN dim_severity s ON f.severity_id = s.severity_id
      LEFT JOIN dim_weather w ON f.weather_id = w.weather_id
      LEFT JOIN dim_date d ON f.date_id = d.date_id
      ${where};
    `,
    values,
  };
}

function getIncidentsByCity(params = {}) {
  const values = [];
  const where = buildIncidentWhere(params, values);

  return {
    text: `
      SELECT
        COUNT(*) AS incident_count,
        l.city
      FROM fact_incidents f
      LEFT JOIN dim_location l ON f.location_id = l.location_id
      LEFT JOIN dim_severity s ON f.severity_id = s.severity_id
      LEFT JOIN dim_weather w ON f.weather_id = w.weather_id
      LEFT JOIN dim_date d ON f.date_id = d.date_id
      ${where}
      GROUP BY l.city
      ORDER BY incident_count DESC;
    `,
    values,
  };
}

function getIncidentsBySeverity(params = {}) {
  const values = [];
  const where = buildIncidentWhere(params, values);

  return {
    text: `
      SELECT
        COUNT(*) AS incident_count,
        s.severity
      FROM fact_incidents f
      LEFT JOIN dim_location l ON f.location_id = l.location_id
      LEFT JOIN dim_severity s ON f.severity_id = s.severity_id
      LEFT JOIN dim_weather w ON f.weather_id = w.weather_id
      LEFT JOIN dim_date d ON f.date_id = d.date_id
      ${where}
      GROUP BY s.severity
      ORDER BY incident_count DESC;
    `,
    values,
  };
}

function getIncidentsByWeather(params = {}) {
  const values = [];
  const where = buildIncidentWhere(params, values);

  return {
    text: `
      SELECT
        COUNT(*) AS incident_count,
        w.weather_condition
      FROM fact_incidents f
      LEFT JOIN dim_location l ON f.location_id = l.location_id
      LEFT JOIN dim_severity s ON f.severity_id = s.severity_id
      LEFT JOIN dim_weather w ON f.weather_id = w.weather_id
      LEFT JOIN dim_date d ON f.date_id = d.date_id
      ${where}
      GROUP BY w.weather_condition
      ORDER BY incident_count DESC;
    `,
    values,
  };
}

function getIncidentsByHour(params = {}) {
  const values = [];
  const where = buildIncidentWhere(params, values);

  return {
    text: `
      SELECT
        COUNT(*) AS incident_count,
        d.hour
      FROM fact_incidents f
      LEFT JOIN dim_location l ON f.location_id = l.location_id
      LEFT JOIN dim_severity s ON f.severity_id = s.severity_id
      LEFT JOIN dim_weather w ON f.weather_id = w.weather_id
      LEFT JOIN dim_date d ON f.date_id = d.date_id
      ${where}
      GROUP BY d.hour
      ORDER BY incident_count DESC;
    `,
    values,
  };
}

function getIncidentsByCause(params = {}) {
  const values = [];
  const where = buildIncidentWhere(params, values);

  return {
    text: `
      SELECT
        COUNT(*) AS incident_count,
        c.cause
      FROM fact_incidents f
      LEFT JOIN dim_location l ON f.location_id = l.location_id
      LEFT JOIN dim_severity s ON f.severity_id = s.severity_id
      LEFT JOIN dim_weather w ON f.weather_id = w.weather_id
      LEFT JOIN dim_date d ON f.date_id = d.date_id
      LEFT JOIN dim_cause c ON f.cause_id = c.cause_id
      ${where}
      GROUP BY c.cause
      ORDER BY incident_count DESC;
    `,
    values,
  };
}

function getIncidentHotspots(params = {}) {
  const values = [];
  const where = buildIncidentWhere(params, values, { requireCoords: true });

  return {
    text: `
      SELECT
        COUNT(*) AS incident_count,
        l.city,
        l.road_name,
        AVG(l.latitude) AS latitude,
        AVG(l.longitude) AS longitude
      FROM fact_incidents f
      LEFT JOIN dim_location l ON f.location_id = l.location_id
      LEFT JOIN dim_severity s ON f.severity_id = s.severity_id
      LEFT JOIN dim_weather w ON f.weather_id = w.weather_id
      LEFT JOIN dim_date d ON f.date_id = d.date_id
      ${where}
      GROUP BY l.city, l.road_name
      ORDER BY incident_count DESC
      LIMIT 250;
    `,
    values,
  };
}

function getIncidentCities() {
  return {
    text: `
      SELECT DISTINCT
        l.city
      FROM dim_location l
      WHERE l.city IS NOT NULL
        AND TRIM(l.city) <> ''
      ORDER BY l.city;
    `,
    values: [],
  };
}

module.exports = {
  getIncidentsSummary,
  getIncidentsByCity,
  getIncidentsBySeverity,
  getIncidentsByWeather,
  getIncidentsByHour,
  getIncidentsByCause,
  getIncidentHotspots,
  getIncidentCities,
};