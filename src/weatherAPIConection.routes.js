import { Router } from "express";
import { Weather } from "./weather.js";
import axios from "axios";

const router = Router();

router.get("/", async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({
            error: "Debe indicar el parámetro 'city' en la consulta.",
        });
    }
    await getBD(res, city);
});

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
        case "openweathermap":
            await getOpenWeatherMap(res, city);
            break;
        case "weatherapi":
            await getWeatherAPI(res, city);
            break;
        default:
            return res.status(404).json({
                error: `La fuente de datos '${req.params.source}' no es válida. Las fuentes válidas son: OpenWeatherMap, WeatherApi o no colocar fuente y acceder a la Base de Datos propia.`,
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
