const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({dest: 'uploads/'});

const { validate, param, type } = require('./validate');

const {
    assets,
    assetDefinitions,
    bboxAssets,
    dataTypes,
    geometrySearch,
    projects,
    temporal
} = require('../controllers');

// Geometry Searches
router.post(
    '/assets/geometrySearch/envelope',
    validate(param.query, 'minimumLatitude', type.latitude, true),
    validate(param.query, 'minimumLongitude', type.longitude, true),
    validate(param.query, 'maximumLatitude', type.latitude, true),
    validate(param.query, 'maximumLongitude', type.longitude, true),
    geometrySearch.envelopeFind
);

// Geometry Searches
router.post(
    '/assets/geometrySearch/distance',
    validate(param.query, 'latitude', type.latitude, true),
    validate(param.query, 'longitude', type.longitude, true),
    validate(param.query, 'radiusMeters', type.radius, true),
    geometrySearch.distanceFind
);

router.post(
    '/assets/geometrySearch/polygon',
    validate(param.body, 'coordinates', type.coordinates, true),
    geometrySearch.polygonFind
);

router.post(
    '/assets/properties/temporalSearch',
    validate(param.body, 'asset_id', type.id),
    validate(param.body, 'sponsor', type.sponsorName),
    validate(param.body, 'project', type.projectName),
    validate(param.body, 'asset_type', type.assetTypeName),
    validate(param.body, 'start_date', type.date),
    validate(param.body, 'end_date', type.date),
    validate(param.body, 'geometry', type.geometry, true),
    temporal.temporalSearch
);

// donor code search
router.post(
    '/assets/donor',
    validate(param.body, 'sponsor_id', type.id),
    validate(param.body, 'project_id', type.id),
    validate(param.body, 'asset_type_id', type.id),
    validate(param.body, 'donor_code', type.donorCode),
    assets.find
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

// CSV for importing data
router.put('/csv', upload.single('csv'), assetDefinitions.storeCSV);

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
