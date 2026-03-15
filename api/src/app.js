const express = require("express")
const cors = require("cors")
const pool = require("./config/db")

const app = express()

//Middleware
app.use(cors())
app.use(express.json())

//Test route
app.get("/api/health"), (req, res) => {
    res.json({status:"API is running"})
}

// Database test
app.get("/api/db-test", async (req,res)=> {
    try{
        const result = await pool.query("SELECT NOW()")
        res.json({
            status: "Database connected",
            time: result.rows[0].now,
        })
    } catch(error) {
        console.log("Database connection error", error.message)
        res.status(500).json({
            status: "database connection failed",
            error: error.message
        })
    }
})

module.exports = app;