const express = require('express');
const router = express.Router();

const { validate, param, type } = require('./validate');

const {
    assets,
    assetDefinitions,
    bboxAssets,
    dataTypes,
    projects
} = require('../controllers');

// Assets
router.get(
    '/assets',
    validate(param.query, 'sponsor_id', type.id),
    validate(param.query, 'project_id', type.id),
    validate(param.query, 'asset_type_id', type.id),
    assets.find
);

router.post('/assets', assets.create);

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


// TODO: Allow Finding Projects by sponsor name (once unique) and by region
// Projects
router.get(
    '/projects',
    validate(param.query, 'id', type.id), // Optional Project ID Parameter
    validate(param.query, 'sponsor_id', type.id), // Optional Sponsor ID Parameter
    validate(param.query, 'name', type.projectName), // Optional Project Name Parameter
    projects.find
);

// TODO: Maybe allow for creating projects with A Sponsor Name (once unique)
// Create projects
router.post('/projects', 
    validate(param.body, 'project', type.project, true),
    projects.create
);
// Example URI
// router.put('/projects/:id', projects.update) // Update an existing project

module.exports = router;