
/* eslint-disable no-console */

const { Pool } = require('pg');

const initializeDbConnections = () => {
    let dbConfig;
    if (process.env.DATABASE_UNIX_SOCKET_DIR) {
        console.log('Configured database to connect using a local UNIX socket');
        dbConfig = {
            host: process.env.DATABASE_UNIX_SOCKET_DIR
        };
    } else {
        console.log('Configured database to connect using a url');
        dbConfig = {
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        };
    }

    global.dbPool = new Pool(dbConfig);
    global.dbPool.on('error', err => console.error(err));
};

module.exports = { initializeDbConnections };