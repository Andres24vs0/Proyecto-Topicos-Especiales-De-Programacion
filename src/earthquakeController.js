onst Counter = require('./Counter');
const Earthquake = require('./Earthquake');

const getEarthquakesByCity = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'Falta el parámetro ?city=' });
    }

    const sismos = await Earthquake.find({ location: new RegExp(`^${city}$`, 'i') }).lean();
    const data = sismos.map(s => ({
      _id: s._id,
      magnitude: s.magnitude,
      depth: s.depth,
      location: s.location,
      date: new Date(s.date).toLocaleDateString('es-VE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }));

    res.status(200).json({ count: data.length, data });
  } catch (error) {
    console.error('Error al buscar por ciudad:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getCities = async (req, res) => {
  try {
    const cities = await Earthquake.distinct('location');
    return res.status(200).json({ cities });
  } catch (error) {
    console.error('Error al obtener ciudades:', error.message);
    return res.status(500).json({ error: 'Error al obtener ciudades únicas' });
  }
};

module.exports = { getEarthquakesByCity, getCities };
