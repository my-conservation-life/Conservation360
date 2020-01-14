const express = require('express');
const router = express.Router();
const fs = require('fs-extra');

const multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let path = '/uploads';
        fs.ensureDirSync(path);
        cb(null, path);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});

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

// Asset Types
router.get('/assetTypes', assetDefinitions.findAssetTypes);

// Asset Properties
router.get('/properties', assetDefinitions.findPropertiesByAssetTypeId);
router.post('/properties', assetDefinitions.updateProperty);

// Bounding Box of Assets
router.get(
    '/bbox-assets',
    validate(param.query, 'project_id', type.id),
    bboxAssets.get
);

// CSV for importing data
router.get('/csv', assets.getCSV);
router.put('/csv', upload.single('csv'), assets.storeCSV);

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
