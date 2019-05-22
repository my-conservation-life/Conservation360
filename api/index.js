const express = require('express');
const {Client} = require("pg");
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
app.use(express.static("./"));

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

client.connect()
    .then(() => {
        console.log("Successfully connected to database");
    })
    .catch(e => {
        console.error(e.stack);
        client.end();
    });

app.get("/getDataTypes", async (req, res) => {
    const query = `
        SELECT name
        FROM data_type
    `;

    queryDB(res, query);
});

// example endpoint
app.get("/getAssetsLocations", async (req, res) => {
    const query = `
        SELECT location
        FROM asset
    `;

    queryDB(res, query);
});

// example endpoint
app.get("/getAssetById", async (req, res) => {
    const id = req.query.id;

    const query = `
        SELECT *
        FROM asset
        WHERE id = ${id}
    `;

    queryDB(res, query);
});

async function queryDB(res, query) {
    try {
        const db = await client.query(query);
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
app.listen(port, () => console.log("Listening on port", port));