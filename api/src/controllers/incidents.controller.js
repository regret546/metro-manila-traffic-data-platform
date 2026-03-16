const pool = require("../config/db")
const {
    getIncidentsSummary,
    getIncidentsByCity,
    getIncidentsBySeverity,
    getIncidentsByWeather,
    getIncidentsByHour,
    getIncidentsByCause
} = require("../queries/incident.queries")

const fetchIncidentSummary = async (req, res) => {
    try{
        const result = await pool.query(getIncidentsSummary)
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
        const result = await pool.query(getIncidentsByCity)
        res.json(result.rows[0])
    }catch(error) {
        console.error("Error fetching incidents by city", error.message)
        res.status(500).json({
            error: "Failed to fetch incident by city"
        })
    }
}

const fetchIncidentsBySeverity = async (req, res) => {
    try {
        const result = await pool.query(getIncidentsBySeverity)
        res.json(result.rows[0])
    }catch (error) {
        console.error("Error fetching incidents by severity", error.message)
        res.status(500).json({
            error: "Faled to fetch incident by severity"
        })

    }
}

const fetchIncidentsByWeather = async (req, res) => {
    try {
        const result = await pool.query(getIncidentsByWeather)
        res.json(result.rows[0])
    }catch(error) {
        console.error("Error fetching incidents by weather", error.message)
        res.status(500).json({
            error: "Failed to fetch incidents by weather"
        })
    }
}

const fetchIncidentsByHour = async (req, res) => {
    try {
        const result = await pool.query(getIncidentsByHour)
        res.json(result.rows[0])
    }catch(error) {
        console.error("Error fetching incidents by hour", error.message)
        res.status(500).json({
            error: "Failed to fetch incidents by hour"
        })
    }
}

const fetchIncidentsByCause = async (req, res) => {
    try {
        const result = await pool.query(getIncidentsByCause)
        res.json(result.rows[0])
    } catch (error) {
        console.error("Error fetching incidents by cause", error.message)
        res.status(500).json({
            error: "Failed to fetch incidents by cause"
        })
    }
}

module.exports = {
    fetchIncidentSummary, 
    fetchIncidentsByCity, 
    fetchIncidentsBySeverity,
    fetchIncidentsByWeather,
    fetchIncidentsByHour,
    fetchIncidentsByCause
}