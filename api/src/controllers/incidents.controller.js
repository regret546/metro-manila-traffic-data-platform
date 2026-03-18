const pool = require("../config/db")
const {
    getIncidentsSummary,
    getIncidentsByCity,
    getIncidentsBySeverity,
    getIncidentsByWeather,
    getIncidentsByHour,
    getIncidentsByCause,
    getIncidentHotspots,
    getIncidentCities
} = require("../queries/incident.queries")

const fetchIncidentSummary = async (req, res) => {
    try{
        const result = await pool.query(getIncidentsSummary(req.query))
        res.json(result.rows[0])
    }catch(error) {
        console.error("Error fetching incidents summary:", error.message)
        res.status(500).json({
            error: "Failed to fetch incident summary"
        })
    }
}

const fetchIncidentsByCity = async (req, res) => {
    try {
        const result = await pool.query(getIncidentsByCity(req.query))
        res.json(result.rows)
    }catch(error) {
        console.error("Error fetching incidents by city", error.message)
        res.status(500).json({
            error: "Failed to fetch incident by city"
        })
    }
}

const fetchIncidentsBySeverity = async (req, res) => {
    try {
        const result = await pool.query(getIncidentsBySeverity(req.query))
        res.json(result.rows)
    }catch (error) {
        console.error("Error fetching incidents by severity", error.message)
        res.status(500).json({
            error: "Faled to fetch incident by severity"
        })

    }
}

const fetchIncidentsByWeather = async (req, res) => {
    try {
        const result = await pool.query(getIncidentsByWeather(req.query))
        res.json(result.rows)
    }catch(error) {
        console.error("Error fetching incidents by weather", error.message)
        res.status(500).json({
            error: "Failed to fetch incidents by weather"
        })
    }
}

const fetchIncidentsByHour = async (req, res) => {
    try {
        const result = await pool.query(getIncidentsByHour(req.query))
        res.json(result.rows)
    }catch(error) {
        console.error("Error fetching incidents by hour", error.message)
        res.status(500).json({
            error: "Failed to fetch incidents by hour"
        })
    }
}

const fetchIncidentsByCause = async (req, res) => {
    try {
        const result = await pool.query(getIncidentsByCause(req.query))
        res.json(result.rows)
    } catch (error) {
        console.error("Error fetching incidents by cause", error.message)
        res.status(500).json({
            error: "Failed to fetch incidents by cause"
        })
    }
}

const fetchIncidentHotspots = async (req, res) => {
    try {
        const result = await pool.query(getIncidentHotspots(req.query))
        res.json(result.rows)
    } catch (error) {
        console.error("Error fetching incident hotspots", error.message)
        res.status(500).json({
            error: "Failed to fetch incident hotspots"
        })
    }
}

const fetchIncidentCities = async (req, res) => {
    try {
        const result = await pool.query(getIncidentCities())
        // Return { city: "..." } rows to keep response consistent with other endpoints.
        res.json(result.rows)
    } catch (error) {
        console.error("Error fetching incident cities", error.message)
        res.status(500).json({
            error: "Failed to fetch incident cities"
        })
    }
}

module.exports = {
    fetchIncidentSummary, 
    fetchIncidentsByCity, 
    fetchIncidentsBySeverity,
    fetchIncidentsByWeather,
    fetchIncidentsByHour,
    fetchIncidentsByCause,
    fetchIncidentHotspots,
    fetchIncidentCities
}