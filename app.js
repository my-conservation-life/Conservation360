/* eslint-disable no-undef */
const express = require('express');
const bodyParser = require('body-parser');

const { Pool } = require('pg');
const routes = {
    v1: require('./v1/routes')
};

require('dotenv').config();
const app = express();
const port = process.env.PORT || 8080;

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json());

app.use(express.static('./client'));

// TODO: remove global val, using global with this to prevent blocking task
global.pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

app.use('/api/v1', routes.v1);

// Start server
// eslint-disable-next-line no-console
app.listen(port, () => console.log('Listening on port', port));