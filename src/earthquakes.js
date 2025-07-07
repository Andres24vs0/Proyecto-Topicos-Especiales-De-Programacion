const express = require('express');
const { postEarthquake} = require('./earthquakeController');
const { validateEarthquake } = require('./validate');

const router = express.Router();
router.post('/', validateEarthquake, postEarthquake);

module.exports = router;
