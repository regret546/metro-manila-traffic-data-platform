
const getIncidentsSummary = 
`SELECT 
	COUNT(*) AS total_incidents,
	COALESCE(SUM(injury_count), 0) AS total_injuries,
	COALESCE(SUM(damage_cost_php), 0) AS total_damage_cost,
	ROUND(COALESCE(AVG(damage_cost_php), 0), 2) AS avg_damage_cost
FROM fact_incidents;`;

const getIncidentsByCity = 
`SELECT 
	COUNT(*) AS incident_count,
	l.city
FROM fact_incidents f
LEFT JOIN dim_location l
ON f.location_id = l.location_id
GROUP BY l.city
ORDER BY incident_count DESC;`


const getIncidentsBySeverity = 
`
SELECT 
	COUNT(*) AS incident_count,
	s.severity
FROM fact_incidents f
LEFT JOIN dim_severity s
ON f.severity_id = s.severity_id
GROUP BY s.severity
ORDER BY incident_count DESC;`

const getIncidentsByWeather =
`SELECT 
	COUNT(*) AS incident_count,
	w.weather_condition
FROM fact_incidents f
LEFT JOIN dim_weather w
ON f.weather_id = w.weather_id
GROUP BY w.weather_condition
ORDER BY incident_count DESC;`

const getIncidentsByHour = 
`SELECT 
	COUNT(*) AS incident_count,
	d.hour
FROM fact_incidents f
LEFT JOIN dim_date d
ON f.date_id = d.date_id
GROUP BY d.hour
ORDER BY incident_count DESC;`

const getIncidentsByCause = 
`SELECT 
	COUNT(*) AS incident_count,
	c.cause
FROM fact_incidents f
LEFT JOIN dim_cause c
ON f.cause_id = c.cause_id
GROUP BY c.cause
ORDER BY incident_count DESC;`

module.exports = {
    getIncidentsSummary,
    getIncidentsByCity,
    getIncidentsBySeverity,
    getIncidentsByWeather,
    getIncidentsByHour,
    getIncidentsByCause
}