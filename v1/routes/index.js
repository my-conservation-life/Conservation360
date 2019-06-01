const express = require('express');
const router = express.Router();

const { assets, bboxAssets } = require('../controllers');

router.get('/assets', assets.find);
router.get('/bbox-assets', bboxAssets.get);

module.exports = router;