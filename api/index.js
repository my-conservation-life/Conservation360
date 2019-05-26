const http = require('http');
const express = require('express');
const { Pool } = require("pg");
const bodyParser = require("body-parser");
require('dotenv').config()

const app = express();
const port = process.env.PORT || 8080;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static("./client"));

const dbPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

// example endpoint
app.get("/getAssetsLocations", async (req, res) => {
    const query = `
        SELECT id, ST_X(location) AS latitude, ST_Y(location) AS longitude
        FROM asset
    `;

    queryDB(res, query);
});

async function queryDB(res, query) {
    try {
        const db = await dbPool.query(query);
        const data = db.rows;

        res.send(JSON.stringify(data));
    } catch (e) {
        const msg = {
            message: "Unable to query database",
            error: e.message
        };
        console.error(e.stack);
        res.status(500).send(msg);
    }
}

// Start server
const server = http.createServer(app);
server.listen(port, () => console.log('Listening on port', port));

// Handle graceful server shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down...');
    server.close(() => {
        console.log('HTTP server has shut down');
        dbPool.end().then(() => {
            console.log('PostgreSQL connections have shut down. This process will exit shortly...');
            process.exitCode = 0;
        });
    });
});