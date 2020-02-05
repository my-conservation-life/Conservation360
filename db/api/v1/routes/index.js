const express = require('express');
const router = express.Router();

const { validate, param, type } = require('./validate');

const {
    assets,
    assetDefinitions,
    bboxAssets,
    dataTypes,
    geometrySearch,
    projects
} = require('../controllers');

// Geometry Searches
router.get(
    '/assets/geometrySearch/envelope',
    validate(param.query, 'minimumLatitude', type.latitude, true),
    validate(param.query, 'minimumLongitude', type.longitude, true),
    validate(param.query, 'maximumLatitude', type.latitude, true),
    validate(param.query, 'maximumLongitude', type.longitude, true),
    geometrySearch.envelopeFind
);

// Geometry Searches
router.get(
    '/assets/geometrySearch/distance',
    validate(param.query, 'latitude', type.latitude, true),
    validate(param.query, 'longitude', type.longitude, true),
    validate(param.query, 'radiusMeters', type.radius, true),
    geometrySearch.distanceFind
);

router.get(
    '/assets/geometrySearch/polygon',
    validate(param.body, 'coordinates', type.coordinates, true),
    geometrySearch.polygonFind
);

// Assets
router.get(
    '/assets',
    validate(param.query, 'sponsor_id', type.id),
    validate(param.query, 'project_id', type.id),
    validate(param.query, 'asset_type_id', type.id),
    assets.find
);

router.post('/assets', assets.create);

router.get('/assetTypes', assetDefinitions.getAssetTypes);
router.post('/assetPropTypes', validate(param.body, 'assetTypeID', type.id, true), assetDefinitions.getAssetPropTypes);
router.post('/assetPropsByTypeID', validate(param.body, 'assetTypeID', type.id, true), assetDefinitions.getAssetPropsByTypeID);

// router.post('/assets', assets.create); //example create
// router.get('/assets/:id', assets.get);
// router.put('/assets/:id', assets.update); //example update

// Asset Definitions
router.get('/assetDefinitions', assetDefinitions.find);
router.post('/assetDefinitions', validate(param.body, 'assetDefinition', type.assetDefinition, true), assetDefinitions.create);

// Bounding Box of Assets
router.get(
    '/bbox-assets',
    validate(param.query, 'project_id', type.id),
    bboxAssets.get
);

// Data Types
router.get('/dataTypes', dataTypes.find);


// Retrieve Projects
router.get(
    '/projects',
    validate(param.query, 'id', type.id), // Optional Project ID Parameter
    validate(param.query, 'sponsor_id', type.id), // Optional Sponsor ID Parameter
    validate(param.query, 'name', type.projectName), // Optional Project Name Parameter
    projects.find
);

// Create projects
router.post(
    '/projects', 
    validate(param.body, 'project', type.project, true),
    projects.create
);

// Update Existing Project
router.put(
    '/projects/:id',
    validate(param.params, 'id', type.id, true),
    validate(param.body, 'project', type.project, true),
    projects.update
);

module.exports = router;
