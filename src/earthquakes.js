const express = require('express');
const { deleteEarthquakeById } = require('./earthquakeController');
const { validateEarthquake } = require('./validate');

const router = express.Router();
router.delete('/:id', deleteEarthquakeById);

module.exports = router;
