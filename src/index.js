
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const earthquakeRoutes = require('./routes/earthquakes');

const app = express();
app.use(express.json());

app.use('/earthquakes', earthquakeRoutes);


const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
=======
mongoose.connection.once("open", () => {
    console.log("Conectado a MongoDB");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
