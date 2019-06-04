const express = require('express');
const router = express.Router();

// TODO: may want to separate into each's folder if this index.js gets too large
const {
    assets,
    assetDefinitions,
    dataTypes
} = require('../controllers');

// Assets
router.get('/assets', assets.getAll);
// router.post('/assets', assets.create); //example create
router.get('/assets/:id', assets.getOne);
// router.put('/assets/:id', assets.update); //example update


// Asset Definitions
router.get('/assetDefinitions', assetDefinitions.getAll);
router.post('/assetDefinitions', assetDefinitions.create);

// Data Types
router.get('/dataTypes', dataTypes.getAll);


module.exports = router;