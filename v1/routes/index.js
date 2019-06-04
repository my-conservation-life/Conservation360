const express = require('express');
const router = express.Router();

const {
    assets,
    assetDefinitions,
    bboxAssets,
    dataTypes
} = require('../controllers');

// Assets
router.get('/assets', assets.find);
// router.post('/assets', assets.create); //example create
// router.get('/assets/:id', assets.get);
// router.put('/assets/:id', assets.update); //example update

// Asset Definitions
router.get('/assetDefinitions', assetDefinitions.getAll);
router.post('/assetDefinitions', assetDefinitions.create);

// Bounding Box of Assets
router.get('/bbox-assets', bboxAssets.get);

// Data Types
router.get('/dataTypes', dataTypes.getAll);

module.exports = router;