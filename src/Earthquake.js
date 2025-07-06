const mongoose = require('mongoose');

const EarthquakeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  magnitude: { type: Number, required: true },
  depth: { type: Number, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true }
});

module.exports = mongoose.model('Earthquake', EarthquakeSchema);
