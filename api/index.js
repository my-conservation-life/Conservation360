const express = require('express');
const {Client} = require("pg");
const bodyParser = require("body-parser");
require('dotenv').config()

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static("./"));

const client = new Client({
    connectionString: process.env.DB_URI,
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
});

// Start server
app.listen(port, () => console.log("Listening on port", port));
