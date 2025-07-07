const Counter = require('./Counter');
const Earthquake = require('./Earthquake');

const postEarthquake = async (req, res) => {
  try {
    const { magnitude, depth, location, date } = req.body;

    const counter = await Counter.findByIdAndUpdate(
      { _id: 'sismo' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const customId = `sismo_${String(counter.seq).padStart(4, '0')}`;

    const nuevo = new Earthquake({
      _id: customId,
      magnitude,
      depth,
      location,
      date
    });

    await nuevo.save();

    return res.status(201).json({ id: customId });
  } catch (error) {
    console.error('Error al guardar sismo:', error.message);
    return res.status(500).json({ error: 'Error al guardar el reporte sísmico' });
  }
};

module.exports = { postEarthquake};
