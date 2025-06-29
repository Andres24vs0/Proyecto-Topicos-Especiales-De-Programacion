import { Router } from "express";
import { Earthquakes } from "./earthquakes.js";
import axios from "axios";

const router = Router();

router.get("/:source", async (req, res) => {
    const source = req.params.source
        ? req.params.source.toLowerCase()
        : undefined;
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
        default:
            return res.status(404).json({
                error: `La fuente de datos '${req.params.source}' no es válida. Las fuentes válidas son: USGS, EMSC o Local.`,
            });
    }
});

async function getBD(res, country) {
    try {
        const resultado = await Earthquakes.findOne({
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
        const eventosFiltrados = eventos.filter((evento) =>
            evento.properties.place
                .toLowerCase()
                .includes(country.toLowerCase())
        );
        if (eventosFiltrados.length === 0) {
            return res.status(400).json({
                error: "No hay registros sísmicos",
            });
        }
        const responseReal = await axios.get(
            eventosFiltrados[0].properties.detail
        );
        const props = responseReal.data.properties;

        if (!props.products || !props.products.origin || !props.products.origin[0] || !props.products.origin[0].properties) {
            return res.status(500).json({
                error: "La respuesta de USGS no tiene la estructura esperada",
            });
        }

        const fecha = new Date(
            props.products.origin[0].properties.eventtime
        );
        const soloFecha = fecha.toISOString().split("T")[0];

        return res.status(200).json({
            magnitude: props.mag,
            depth: props.products.origin[0].properties.depth,
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
        const url = `https://www.seismicportal.eu/fdsnws/event/1/query?format=json&orderby=time&&minlatitude=${coordenadas[0]}&maxlatitude=${coordenadas[1]}&minlongitude=${coordenadas[2]}&maxlongitude=${coordenadas[3]}`;
        const response = await axios.get(url);

        const eventos = response.data.features;
        const eventosFiltrados = eventos.filter((evento) =>
            evento.properties.flynn_region
                .toLowerCase()
                .includes(country.toLowerCase())
        );
        if (eventosFiltrados.length === 0) {
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
        console.error(
            "Error en getCoordinates:",
            error.message,
        );
        return null;
    }
}

export default router;
