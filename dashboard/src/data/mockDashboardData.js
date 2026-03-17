export const kpis = [
  { id: "incidents", label: "Total Incidents", value: "7,456", tone: "blue" },
  { id: "injuries", label: "Total Injuries", value: "3,210", tone: "amber" },
  { id: "damageTotal", label: "Total Damage Cost", value: "$2,893,450", tone: "green" },
  { id: "damageAvg", label: "Avg Damage Cost", value: "$388", tone: "indigo" },
];

export const incidentsOverTimeMonthly = [
  { name: "Mar 1", incidents: 820 },
  { name: "Mar 6", incidents: 910 },
  { name: "Mar 11", incidents: 860 },
  { name: "Mar 16", incidents: 940 },
  { name: "Mar 21", incidents: 1120 },
  { name: "Mar 26", incidents: 1180 },
  { name: "Apr 1", incidents: 1420 },
  { name: "Apr 6", incidents: 1280 },
  { name: "Apr 11", incidents: 1210 },
  { name: "Apr 16", incidents: 990 },
  { name: "Apr 21", incidents: 1060 },
  { name: "Apr 26", incidents: 1300 },
  { name: "May 1", incidents: 1140 },
  { name: "May 6", incidents: 1040 },
];

export const incidentsOverTimeDaily = [
  { name: "Mon", incidents: 980 },
  { name: "Tue", incidents: 1120 },
  { name: "Wed", incidents: 1050 },
  { name: "Thu", incidents: 1240 },
  { name: "Fri", incidents: 1410 },
  { name: "Sat", incidents: 1260 },
  { name: "Sun", incidents: 1100 },
];

export const incidentsByCity = [
  { city: "Quezon City", value: 2100 },
  { city: "Manila", value: 1500 },
  { city: "Caloocan", value: 1200 },
  { city: "Makati", value: 900 },
  { city: "Pasig", value: 850 },
];

export const vehicleTypeDistribution = [
  { name: "Cars", value: 55, color: "var(--color-chart-1)" },
  { name: "Motorcycles", value: 30, color: "var(--color-chart-4)" },
  { name: "Trucks", value: 10, color: "var(--color-chart-3)" },
  { name: "Buses", value: 5, color: "var(--color-chart-2)" },
];

export const severityBreakdown = [
  { name: "Minor", value: 3200, color: "var(--color-chart-3)" },
  { name: "Serious", value: 3500, color: "var(--color-chart-1)" },
  { name: "Fatal", value: 756, color: "var(--color-chart-5)" },
];

export const hotspots = [
  { id: "manila-1", label: "Manila", lat: 14.5995, lng: 120.9842, intensity: 0.95 },
  { id: "manila-2", label: "Manila", lat: 14.607, lng: 120.989, intensity: 0.75 },
  { id: "qc-1", label: "Quezon City", lat: 14.676, lng: 121.0437, intensity: 0.8 },
  { id: "makati-1", label: "Makati", lat: 14.5547, lng: 121.0244, intensity: 0.65 },
  { id: "pasig-1", label: "Pasig", lat: 14.5764, lng: 121.0851, intensity: 0.55 },
];

export const recentIncidents = [
  { id: "#7455", date: "Apr 22", city: "Manila", road: "Roxas Blvd", severity: 2 },
  { id: "#7454", date: "Apr 21", city: "Quezon City", road: "Commonwealth Ave", severity: 8 },
  { id: "#7453", date: "Apr 20", city: "Makati", road: "Ayala Ave", severity: 1500 },
  { id: "#7452", date: "Apr 16", city: "Pasig", road: "Ortigas Ave", severity: 9 },
  { id: "#7451", date: "Apr 15", city: "Caloocan", road: "EDSA", severity: 300000 },
  { id: "#7450", date: "Apr 15", city: "Eton", road: "Motorcycle", severity: 1 },
];

