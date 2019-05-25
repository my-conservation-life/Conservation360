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
app.use(express.static("./client"));

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

app.get("/getAllAssetProperties", async (req, res) => {
    const query = `        
        SELECT 
            asset_type.name as asset_type,
            asset_type.description,
            property.name,
            property.data_type,
            property.required,
            property.is_private
        FROM
            property
        JOIN
            asset_type
        on
            property.asset_type_id = asset_type.id
    `;

    queryDB(res, query);
});

app.post("/createAssetDefinition", async (req, res) => {
    // Body of data sent by the client's post request
    const body = req.body;

    // Create parameterized query
    const createAssetTypeQuery = {
        text: `
            INSERT INTO asset_type
                (name, description)
            VALUES
                ($1, $2)
            RETURNING id
        `,
        values: [
            body.name,
            body.description
        ]
    };

    // TODO: extract
    function handleErrors(res, e) {
        const msg = {
            message: "Unable to query database",
            error: e.message
        };
        console.error(e.stack);
        res.status(500).send(msg);
    }

    try {
        const db = await client.query(createAssetTypeQuery);
        const assetTypeId = db.rows[0].id; // Id of newly created asset type

        const queryPromises = [];

        // Asset type created, now for properties
        for (let property of body.properties) {
            const createPropertyQuery = {
                text: `
                    INSERT INTO property
                        (asset_type_id, name, data_type, required, is_private)
                    VALUES
                        ($1, $2, $3, $4, $5)
                `,
                values: [
                    assetTypeId,
                    property.name,
                    property.data_type,
                    property.required,
                    property.is_private
                ]
            }

            // Add to promises list so we can tell when they all finish
            queryPromises.push(
                client.query(createPropertyQuery)
                    .then(res => console.log("createAssetDefinition Successful"))
                    .catch(e => {
                        handleErrors(res, e);
                    })
            );
        }

        // When all properties are finished creating, send success message
        Promise.all(queryPromises)
            .then(() => {
                const msg = {
                    message: "Asset definition successfuly created"
                }
                res.status(201).send(msg)
            })
            .catch(e => {
                handleErrors(res, e);
            });

    } catch (e) {
        handleErrors(res, e);
    }
})

// example endpoint
app.get("/getAssetsLocations", async (req, res) => {
    const query = `
        SELECT location
        FROM asset
    `;

    queryDB(res, query);
});

// example endpoint
// app.get("/getAssetById", async (req, res) => {
//     const id = req.query.id;

//     const query = `
//         SELECT *
//         FROM asset
//         WHERE id = ${id}
//     `;

//     queryDB(res, query);
// });

async function queryDB(res, query, values) {
    try {
        // values are for parameterized queries to prevents sql injection
        const db = await client.query(query, values);

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