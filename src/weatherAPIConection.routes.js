import { Router } from "express";
import { Weather } from "./weather.js";
import axios from "axios";

const router = Router();

/**
 * @swagger
 * /weather/{source}:
 *   get:
 *     summary: Obtiene el clima de una ciudad desde una API externa.
 *     description: Obtiene el clima de una ciudad consultando una fuente externa (OpenWeatherMap o WeatherApi) o la base de datos propia (Local).
 *     parameters:
 *       - in: path
 *         name: source
 *         required: true
 *         schema:
 *           type: string
 *           enum: [openweathermap, weatherapi,local]
 *         description: Fuente de datos externa (OpenWeatherMap o WeatherApi) o la base de datos propia (Local), los nombres no son sensibles a mayúsculas ni minúsculas.
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre de la ciudad a la que quieres consultar el clima.
 *     responses:
 *       200:
 *         description: Respuesta exitosa con datos del clima.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 city:
 *                   type: string
 *                   description: Nombre de la ciudad consultada.
 *                 temperature:
 *                   type: number
 *                   description: Temperatura actual de la ciudad consultada.
 *                 humidity:
 *                   type: number
 *                   description: Humedad actual de la ciudad consultada.
 *                 condition:
 *                   type: string
 *                   description: Condicion de clima actual de la ciudad consultada (Soleado, nublado, lluvioso o tormenta).
 *       400:
 *         description: Ciudad no encontrada o parámetro faltante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje del error ocurrido.
 *       404:
 *         description: Fuente de datos no válida.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje del error ocurrido.
 *       500:
 *         description: Error de conexión con la Base de Datos o con alguna de las APIs externas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje del error ocurrido.
 */
router.get("/:source", async (req, res) => {
    const source = req.params.source
        ? req.params.source.toLowerCase()
        : undefined;
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({
            error: "Debe indicar el parámetro 'city' en la consulta.",
        });
    }
    switch (source) {
        case "local":
            await getBD(res, city);
            break;
        case "openweathermap":
            await getOpenWeatherMap(res, city);
            break;
        case "weatherapi":
            await getWeatherAPI(res, city);
            break;
        default:
            return res.status(404).json({
                error: `La fuente de datos '${req.params.source}' no es válida. Las fuentes válidas son: OpenWeatherMap, WeatherApi o Local.`,
            });
    }
});

async function getBD(res, city) {
    try {
        const resultado = await Weather.findOne({ city: city }).sort({
            date: -1,
        });
        if (!resultado) {
            return res.status(400).json({
                error: "No hay registros climáticos",
            });
        } else {
            return res.status(200).json({
                city: city,
                temperature: resultado.temperature,
                humidity: resultado.humidity,
                condition: resultado.condition,
            });
        }
    } catch {
        return res.status(500).json({
            error: "Error de conexión o consulta a la base de datos",
        });
    }
}

async function getOpenWeatherMap(res, city) {
    try {
        const { OPENWEATHERMAP_KEY } = process.env;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHERMAP_KEY}`;
        const response = await axios.get(url);

        const clima = response.data.weather && response.data.weather[0];
        const main = response.data.main;
        let condition;
        switch (clima?.main) {
            case "Thunderstorm":
                condition = "Tormenta";
                break;
            case "Drizzle":
            case "Rain":
            case "Snow":
                condition = "Lluvioso";
                break;
            case "Clear":
                condition = "Soleado";
                break;
            default:
                condition = "Nublado";
                break;
        }
        return res.status(200).json({
            city: city,
            temperature: main.temp,
            humidity: main.humidity,
            condition: condition,
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(400).json({
                error: "La ciudad no fue encontrada en OpenWeatherMap",
            });
        }
        return res.status(500).json({
            error: "Error de conexión con la API OpenWeatherMap",
        });
    }
}

async function getWeatherAPI(res, city) {
    try {
        const { WEATHER_API_KEY } = process.env;
        const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}&aqi=no`;
        const response = await axios.get(url);

        const datos = response.data.current;
        const cond = datos.condition;
        let condition;
        if (cond.code === 1000) {
            condition = "Soleado";
        } else if (cond.code > 1000 && cond.code <= 1171) {
            condition = "Nublado";
        } else if (cond.code > 1171 && cond.code <= 1264) {
            condition = "Lluvioso";
        } else if (cond.code > 1264) {
            condition = "Tormenta";
        }
        return res.status(200).json({
            city: city,
            temperature: datos.temp_c,
            humidity: datos.humidity,
            condition: condition,
        });
    } catch (error) {
        if (error.response && error.response.status === 400) {
            return res.status(400).json({
                error: "La ciudad no fue encontrada en WeatherAPI",
            });
        }
        return res.status(500).json({
            error: "Error de conexión con la API WeatherAPI",
        });
    }
}

export default router;
