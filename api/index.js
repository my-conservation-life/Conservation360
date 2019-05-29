const http = require('http');
const express = require('express');
const { Pool } = require("pg");
const bodyParser = require("body-parser");
require('dotenv').config()

/**
 * Maximum value supported by the PostgreSQL integer type.
 */
const DB_INTEGER_MAX = 2147483647;

/**
 * Test a given number if it is in the bounds of the PostgreSQL integer type.
 * 
 * @param {number} id - number to check
 */
const isValidDbInteger = (id) => id > 0 && id <= DB_INTEGER_MAX;

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

/**
 * Parse the given string as a DB integer key
 * 
 * @param {string} str - String to parse
 * @returns result - Parse result
 */
const dbKeyParser = (str) => {
    const id = Number.parseInt(str, 10);
    return (id && isValidDbInteger(id)) ? { value: id } : { error: 'Not a positive integer' };
};

/**
 * Call the callback if the value of the given query string parameter can be parsed by parser.
 * Otherwise, send an error response.
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {string} param Name of the required parameter in the query string
 * @param {*} parser 
 * @param {*} onSuccess 
 * @param {*} [onNotSpecified]
 */
const withQueryParam = (req, res, param, parser, onSuccess, onNotSpecified = (() => {})) => {
    const paramValue = req.query[param];

    if (typeof paramValue !== 'string') {
        onNotSpecified();
        return;
    }

    const parseResult = parser(paramValue);

    if (parseResult.error) {
        res.status(500).send({ error: `Invalid argument for the ${param} parameter. Error: ` + parseResult.error })
    } else {
        onSuccess(parseResult.value);
    }
};

// query string parameters:
// project_id (type: number, optional): filter to assets belonging to the given project_id
app.get('/assets', async (req, res) => {
    const projectIdString = req.query['project_id'];

    const query = `
        SELECT id, project_id, asset_type_id, ST_X(location) AS latitude, ST_Y(location) AS longitude
        FROM asset`;

    if (projectIdString) {
        const projectId = Number.parseInt(projectIdString, 10);
        if (projectId && isValidDbInteger(projectId)) {
            queryDB(res, query + ' WHERE project_id = $1', [projectId]);
        } else {
            res.status(500).send({ error: 'Invalid argument for the project_id parameter. Expected a positive integer.' });
        }
    } else {
        queryDB(res, query);
    }
});

/**
 * Get the bounding box of assets
 * 
 * If project_id is provided as a query parameter,
 * consider only assets with this project_id.
 * 
 * @param {string} [req.query.project_id] - Project ID of assets
 */
app.get('/bbox-assets', async (req, res) => {
    const query = `
        SELECT ST_XMin(bbox) AS latitude_min, ST_XMax(bbox) AS latitude_max, ST_YMin(bbox) AS longitude_min, ST_YMax(bbox) AS longitude_max
        FROM (SELECT ST_Extent(location) AS bbox from asset)
        AS tbbox
    `;

    const withResult = (result) => {
        const bbox = result.rows[0];
        if (bbox) {
            res.json(bbox);
        } else {
            res.status(500).send({ error: 'Unable to query DB for bounding box' });
        }
    };

    withQueryParam(req, res, 'project_id', dbKeyParser,
        (projectId) => {
            const query = query + ' WHERE project_id = $1';
            queryDbResult(res, query, [projectId], withResult);
        },
        () => {
            queryDbResult(res, query, [], withResult);
        });
});

/**
 * Execute the query.
 * 
 * If successful, call onSuccess with the Result.
 * Otherwise, send a 500 error response.
 * 
 * @param {Response} res
 * @param {string} query Database query to execute
 * @param {string[]} values Substitution parameters for the query
 * @param {*} onSuccess
 */
const queryDbResult = async (res, query, values, onSuccess) => {
    try {
        const result = await dbPool.query(query, values);
        onSuccess(result);
    } catch (e) {
        const msg = {
            message: "Unable to query database",
            error: e.message
        };
        console.error(e.stack);
        res.status(500).send(msg);
    }
}

async function queryDB(res, query, values) {
    try {
        const db = await dbPool.query(query, values);
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