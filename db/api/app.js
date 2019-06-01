const http = require('http');
const express = require('express');
const routes = {
    v1: require('./v1/routes')
};
const { Pool } = require("pg");
const bodyParser = require("body-parser");
require('dotenv').config();

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

global.dbPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

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