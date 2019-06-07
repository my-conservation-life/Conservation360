const express = require('express');
const router = express.Router();

const { validate, param, type } = require('./validate');

const {
    assets,
    assetDefinitions,
    bboxAssets,
    dataTypes
} = require('../controllers');

// Assets
router.get('/assets', validate(param.query, 'project_id', type.id), assets.find);
// router.post('/assets', assets.create); //example create
// router.get('/assets/:id', assets.get);
// router.put('/assets/:id', assets.update); //example update

// Asset Definitions
router.get('/assetDefinitions', assetDefinitions.find);
router.post('/assetDefinitions', assetDefinitions.create);

// Bounding Box of Assets
router.get('/bbox-assets', validate(param.query, 'project_id', type.id), bboxAssets.get);

// Data Types
router.get('/dataTypes', dataTypes.find);

module.exports = router;