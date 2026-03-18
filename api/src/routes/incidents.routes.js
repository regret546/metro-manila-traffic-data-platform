const express = require("express")
const router = express.Router()

const {
    fetchIncidentSummary,
    fetchIncidentsByCity, 
    fetchIncidentsBySeverity,
    fetchIncidentsByWeather,
    fetchIncidentsByHour,
    fetchIncidentsByCause,
    fetchIncidentHotspots,
    fetchIncidentCities
} = require("../controllers/incidents.controller")


router.get("/summary", fetchIncidentSummary)
router.get("/by-city", fetchIncidentsByCity)
router.get("/by-severity", fetchIncidentsBySeverity)
router.get("/by-weather", fetchIncidentsByWeather)
router.get("/by-hour", fetchIncidentsByHour)
router.get("/by-cause", fetchIncidentsByCause)
router.get("/hotspots", fetchIncidentHotspots)
router.get("/cities", fetchIncidentCities)

module.exports = router