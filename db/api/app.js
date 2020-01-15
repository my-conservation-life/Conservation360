/* eslint-disable no-console */

const express = require('express');
const cors = require('cors');
const routes = {
    v1: require('./v1/routes')
};
const bodyParser = require('body-parser');

const app = express();

app.options('*', cors());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static('./client'));
app.use('/api/v1', routes.v1);

module.exports = app;