const path = require('path');
const { initializeDbConnections } = require('../db');
var fs = require('fs');

/**
 * Setup the database test environment asynchronously.
 * Connects to the database from the test env found in
 * 'db/api/tests/.env' and installs the schema.
 * 
 * @returns {Promise<any>} a promise that resolves when the setup is complete
 */
const setup = async () => {
    const envPath = path.resolve(__dirname + '/.env');

    // Use the test .env file within 'db/api/tests/'
    require('dotenv').config({ path: envPath });

    initializeDbConnections();
    await loadSQL('../schema/schema.sql');
};

/**
 * Execute the SQL script asynchronously
 *
 * @param {string} fileName path to the SQL script
 * @returns {Promise<any>} a promise that resolves when the SQL script has finished execution
 */
const loadSQL = (fileName) => {
    var schema = fs.readFileSync(fileName, {
        encoding: 'utf8'
    });

    return global.dbPool.query(schema);
};

/**
 * Disconnect from the database asynchronously
 *
 * @returns {Promise<any>} a promise that resolves when this process has finished disconnecting from the database
 */
const teardown = () => global.dbPool.end();

module.exports = { setup, teardown, loadSQL };
