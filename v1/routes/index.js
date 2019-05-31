const express = require('express')
const router = express.Router()

const { 
    assets
} = require('../controllers')

router.get('/assets', assets.getAll);
router.get('/assets/:id', assets.getOne);


module.exports = router