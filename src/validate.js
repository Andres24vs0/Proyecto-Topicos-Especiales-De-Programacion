
const validateEarthquake = (req, res, next) => {
  const { magnitude, depth, location, date } = req.body;
  if (
    typeof magnitude !== 'number' ||
    typeof depth !== 'number' ||
    typeof location !== 'string' ||
    isNaN(Date.parse(date))
  ) {
    return res.status(400).json({ error: 'Datos de terremoto inválidos' });
  }
  next();
};

export { validateEarthquake};

