const assets = require('./assets.controller');
const assetDefinitions = require('./assetDefinitions.controller');
const bboxAssets = require('./bboxAssets.controller');
const dataTypes = require('./dataTypes.controller');
const geometrySearch = require('./geometrySearch.controller');
const projects = require('./projects.controller');
const temporal = require('./temporal.controller');

module.exports = {
    assets,
    assetDefinitions,
    bboxAssets,
    dataTypes,
    geometrySearch,
    projects,
    temporal
};
