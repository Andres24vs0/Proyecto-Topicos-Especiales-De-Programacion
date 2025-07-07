const express = require('express');
const { getCities } = require('./earthquakeController');
const { getEarthquakesByCity } = require('./earthquakeController');
const { validateEarthquake } = require('./validate');

const router = express.Router();
router.get('/cities', getCities);
router.get('/', getEarthquakesByCity); 

module.exports = router;
