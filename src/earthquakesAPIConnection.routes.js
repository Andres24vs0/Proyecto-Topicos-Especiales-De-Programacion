import { Router } from "express";
import { Earthquake } from "./Earthquake.js";
import axios from "axios";

const router = Router();

const estadosUSA = [
    "alabama",
    "alaska",
    "arizona",
    "arkansas",
    "california",
    "colorado",
    "connecticut",
    "delaware",
    "florida",
    "georgia",
    "hawaii",
    "idaho",
    "illinois",
    "indiana",
    "iowa",
    "kansas",
    "kentucky",
    "louisiana",
    "maine",
    "maryland",
    "massachusetts",
    "michigan",
    "minnesota",
    "mississippi",
    "missouri",
    "montana",
    "nebraska",
    "nevada",
    "new hampshire",
    "new jersey",
    "new mexico",
    "new york",
    "north carolina",
    "north dakota",
    "ohio",
    "oklahoma",
    "oregon",
    "pennsylvania",
    "rhode island",
    "south carolina",
    "south dakota",
    "tennessee",
    "texas",
    "utah",
    "vermont",
    "virginia",
    "washington",
    "west virginia",
    "wisconsin",
    "wyoming",
];

/**
 * @swagger
 * /earthquakes/{source}:
 *   get:
 *     summary: Obtiene el último sismo de un pais desde una API externa.
 *     description: Obtiene el último sismo de un pais consultando una fuente externa (USGS o EMSC) o la base de datos propia (Local).
 *     parameters:
 *       - in: path
 *         name: source
 *         required: true
 *         schema:
 *           type: string
 *           enum: [USGS, EMSC,local]
 *         description: Fuente de datos externa (USGS o EMSC) o la base de datos propia (Local), los nombres no son sensibles a mayúsculas ni minúsculas.
 *       - in: query
 *         name: country
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del país que se quiere consultar, el nombre del país ha de ser manejado en inglés.
 *     responses:
 *       200:
 *         description: Respuesta exitosa con datos del sismo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 magnitude:
 *                   type: number
 *                   description: Magnitud del sismo.
 *                 depth:
 *                   type: number
 *                   description: Profundidad del sismo.
 *                 location:
 *                   type: string
 *                   description: Ubicación del sismo.
 *                 date:
 *                   type: string
 *                   description: Fecha del sismo en formato YYYY-MM-DD.
 *       400:
 *         description: País no encontrada o parámetro faltante
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
    // Validar fuente primero
    if (!["local", "usgs", "emsc"].includes(source)) {
        return res.status(404).json({
            error: `La fuente de datos '${req.params.source}' no es válida. Las fuentes válidas son: USGS, EMSC o Local.`,
        });
    }
    // Luego validar parámetro country
    const country = req.query.country;
    if (!country) {
        return res.status(400).json({
            error: "Debe indicar el parámetro 'country' en la consulta.",
        });
    }
    switch (source) {
        case "local":
            await getBD(res, country);
            break;
        case "usgs":
            await getUSGS(res, country);
            break;
        case "emsc":
            await getEMSC(res, country);
            break;
    }
});

async function getBD(res, country) {
    try {
        const resultado = await Earthquake.findOne({
            location: { $regex: country, $options: "i" },
        }).sort({
            date: -1,
        });
        if (!resultado) {
            return res.status(400).json({
                error: "No hay registros sísmicos",
            });
        } else {
            // Formatear la fecha a YYYY-MM-DD
            let soloFecha = resultado.date;
            if (soloFecha instanceof Date) {
                soloFecha = soloFecha.toISOString().split("T")[0];
            }
            return res.status(200).json({
                magnitude: resultado.magnitude,
                depth: resultado.depth,
                location: resultado.location,
                date: soloFecha,
            });
        }
    } catch (error) {
        console.error("Error en getBD:", error.message, error.stack);
        return res.status(500).json({
            error: "Error de conexión o consulta a la base de datos",
        });
    }
}

function getEventosFiltrados(eventos, country, key) {
    // key: 'place' para USGS, 'flynn_region' para EMSC
    const countryLower = country.toLowerCase();
    if (
        countryLower === "united states of america" ||
        countryLower === "usa" ||
        countryLower === "united states"
    ) {
        // Buscar por estados para USA
        return eventos.filter((evento) => {
            const region = evento.properties[key]?.toLowerCase() || "";
            return estadosUSA.some((estado) => region.includes(estado));
        });
    } else {
        // Buscar por país
        return eventos.filter((evento) => {
            const region = evento.properties[key]?.toLowerCase() || "";
            return region.includes(countryLower);
        });
    }
}

async function getUSGS(res, country) {
    try {
        const coordenadas = await getCoordinates(country);
        if (!coordenadas) {
            return res.status(400).json({
                error: "Las coordenadas del pais no fueron encontradas",
            });
        }
        const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=time&limit=100&minlatitude=${coordenadas[0]}&maxlatitude=${coordenadas[1]}&minlongitude=${coordenadas[2]}&maxlongitude=${coordenadas[3]}`;
        const response = await axios.get(url);
        const data = response.data;
        const eventos = data.features;
        const eventosFiltrados = getEventosFiltrados(eventos, country, "place");
        if (eventosFiltrados.length === 0) {
            return res.status(400).json({
                error: "No hay registros sísmicos",
            });
        }
        const responseReal = await axios.get(
            eventosFiltrados[0].properties.detail
        );
        const props = responseReal.data.properties;

        if (
            !props.products ||
            !props.products.origin ||
            !props.products.origin[0] ||
            !props.products.origin[0].properties
        ) {
            return res.status(500).json({
                error: "La respuesta de USGS no tiene la estructura esperada",
            });
        }

        const fecha = new Date(props.products.origin[0].properties.eventtime);
        const soloFecha = fecha.toISOString().split("T")[0];

        return res.status(200).json({
            magnitude: props.mag,
            depth: parseInt(props.products.origin[0].properties.depth),
            location: props.place,
            date: soloFecha,
        });
    } catch (error) {
        console.error(
            "Error en getUSGS:",
            error.message,
            error.response?.data,
            error.stack
        );
        if (error.response && error.response.status === 404) {
            return res.status(400).json({
                error: "Las coordenadas del pais no fueron encontradas",
            });
        }
        return res.status(500).json({
            error: "Error de conexión con la API USGS",
        });
    }
}

async function getEMSC(res, country) {
    try {
        const coordenadas = await getCoordinates(country);
        if (!coordenadas) {
            return res.status(400).json({
                error: "Las coordenadas del pais no fueron encontradas",
            });
        }
        const url = `https://www.seismicportal.eu/fdsnws/event/1/query?format=json&orderby=time&limit=100&minlatitude=${coordenadas[0]}&maxlatitude=${coordenadas[1]}&minlongitude=${coordenadas[2]}&maxlongitude=${coordenadas[3]}`;
        const response = await axios.get(url);

        const eventos = response.data.features;
        const eventosFiltrados = getEventosFiltrados(
            eventos,
            country,
            "flynn_region"
        );
        if (
            eventosFiltrados.length === 0 ||
            !eventosFiltrados[0] ||
            !eventosFiltrados
        ) {
            return res.status(400).json({
                error: "No hay registros sísmicos",
            });
        }
        // Formatear la fecha a YYYY-MM-DD
        let soloFecha = eventosFiltrados[0].properties.time;
        if (soloFecha) {
            soloFecha = new Date(soloFecha).toISOString().split("T")[0];
        }
        return res.status(200).json({
            magnitude: eventosFiltrados[0].properties.mag,
            depth: eventosFiltrados[0].properties.depth,
            location: eventosFiltrados[0].properties.flynn_region,
            date: soloFecha,
        });
    } catch (error) {
        console.error(
            "Error en getEMSC:",
            error.message,
            error.response?.data,
            error.stack
        );
        if (error.response && error.response.status === 400) {
            return res.status(400).json({
                error: "Las coordenadas del pais no fueron encontradas",
            });
        }
        return res.status(500).json({
            error: "Error de conexión con la API EMSC",
        });
    }
}

async function getCoordinates(country) {
    try {
        const userAgent = process.env.NOMINATIM_EMAIL || "tucorreo@ucab.edu.ve";
        const url = `https://nominatim.openstreetmap.org/search?country=${country}&format=json&limit=1&polygon_geojson=1`;
        const response = await axios.get(url, {
            headers: {
                "User-Agent": `UCAB-Proyecto-Topicos/1.0 (${userAgent})`,
            },
        });
        if (response.data.length === 0) {
            return null;
        } else {
            const coordenadas = response.data[0].boundingbox;
            return coordenadas;
        }
    } catch (error) {
        console.error("Error en getCoordinates:", error.message);
        return null;
    }
}

export default router;
