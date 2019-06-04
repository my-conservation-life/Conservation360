/* eslint-disable no-console */

const http = require('http');
const express = require('express');
const routes = {
    v1: require('./v1/routes')
};
const { Pool } = require('pg');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static('./client'));

let dbConfig;
if (process.env.DATABASE_UNIX_SOCKET_DIR) {
    console.log('Configured database to connect using a local UNIX socket');
    dbConfig = {
        host: process.env.DATABASE_UNIX_SOCKET_DIR
    };
} else {
    dbConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    };
}

global.dbPool = new Pool(dbConfig);
global.pool = global.dbPool;

app.use('/api/v1', routes.v1);

// Start server
const server = http.createServer(app);
server.listen(port, () => console.log('Listening on port', port));

// Handle graceful server shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down...');
    server.close(() => {
        console.log('HTTP server has shut down');
        global.dbPool.end().then(() => {
            console.log('PostgreSQL connections have shut down. This process will exit shortly...');
            process.exitCode = 0;
        });
    });
});
