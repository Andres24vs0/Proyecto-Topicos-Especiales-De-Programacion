const Counter = require('./counter');
const Earthquake = require('./Earthquake');

const deleteEarthquakeById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Earthquake.findOneAndDelete({ _id: id });

    if (!deleted) {
      return res.status(404).json({ error: `No se encontró el sismo con ID ${id}` });
    }

    res.status(200).json({ message: `Sismo con ID ${id} eliminado correctamente` });
  } catch (error) {
    console.error('Error al eliminar sismo:', error.message);
    res.status(500).json({ error: 'Error al eliminar el sismo' });
  }
};

module.exports = {deleteEarthquakeById };
