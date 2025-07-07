const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const earthquakeRoutes = require('./earthquakes');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
}).then(() => {
  console.log('Conectado a MongoDB Atlas');
}).catch((err) => {
  console.error('Error de conexión:', err.message);
});

const app = express();
app.use(express.json());
app.use('/earthquakes', earthquakeRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
