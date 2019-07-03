const { initializeDbConnections } = require('../db');
var fs = require('fs');
const setup = () => {
    require('dotenv').config();
    // ENTER YOUR TEST DB CONNECTION CONFIG HERE
    initializeDbConnections();
    // Read file
    loadSQL('../schema/schema.sql');
};

const loadSQL = fileName => {
    var schema = fs.readFileSync(fileName, {
        encoding: 'utf8'
    });
    global.dbPool.query(schema);
};
const teardown = () => {
    global.dbPool.end();
};
module.exports = { setup, teardown, loadSQL };
