/* eslint-disable no-console */
const http = require('http');
const app = require('./app');
const { initializeDbConnections } = require('./db');

const envResult = require('dotenv').config();
if (envResult.error) {
    throw envResult.error;
}

initializeDbConnections();

const port = process.env.PORT || 8080;

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
