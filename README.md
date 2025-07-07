# API de Sismos y Clima

Este proyecto implementa una API RESTful para la gestión y consulta de información sobre sismos y condiciones climáticas. Está desarrollada con Node.js, Express y MongoDB (Mongoose) por Andrés Valdivieso, Edwin Li y José Oropeza.

## Endpoints principales

### Sismos

-   **GET /earthquakes?city=NombreCiudad**

    -   Devuelve todos los sismos registrados en la base de datos para la ciudad indicada.
    -   Ejemplo de respuesta:
        ```json
        {
            "count": 2,
            "data": [
                {
                    "_id": "sismo_3007",
                    "magnitude": 6.1,
                    "depth": 18,
                    "location": "TestCity3007",
                    "date": "25/07/2025"
                }
            ]
        }
        ```

-   **POST /earthquakes**

    -   Permite registrar un nuevo sismo. Se deben enviar los campos: `magnitude`, `depth`, `location`, `date`.
    -   Ejemplo de body:
        ```json
        {
            "magnitude": 5.8,
            "depth": 12,
            "location": "Los Andes",
            "date": "2025-07-15"
        }
        ```
    -   Respuesta exitosa: `{ "id": "sismo_XXXX" }`

-   **DELETE /earthquakes/:id**
    -   Elimina un sismo por su identificador único.
    -   Respuesta exitosa: `{ "message": "Sismo sismo_XXXX eliminado" }`

### Clima

-   **POST /weather**

    -   Registra un nuevo dato de clima. Campos requeridos: `city`, `temperature`, `humidity`, `condition` ("Soleado", "Lluvioso", "Nublado", "Tormenta").
    -   Respuesta exitosa: `{ "message": "Clima guardado exitosamente", "data": { ... } }`

-   **GET /weather/history/:city**

    -   Devuelve el historial de registros climáticos para una ciudad.
    -   Ejemplo de respuesta:
        ```json
        {
            "city": "Madrid",
            "total": 2,
            "data": [
                {
                    "temperature": 20,
                    "humidity": 50,
                    "condition": "Soleado",
                    "date": "..."
                },
                {
                    "temperature": 22,
                    "humidity": 55,
                    "condition": "Nublado",
                    "date": "..."
                }
            ]
        }
        ```

-   **DELETE /weather/:id**

    -   Elimina un registro climático por su ID (formato: `id:clima_X`).
    -   Respuesta exitosa: `{ "message": "Registro eliminado exitosamente" }`

-   **GET /weather/:source?city=NombreCiudad**
    -   Consulta el clima actual de una ciudad usando una fuente externa (`openweathermap`, `weatherapi`) o la base de datos local (`local`).
    -   Ejemplo: `/weather/local?city=Caracas`

## Estructura de la base de datos

-   **Sismos:**

    -   `_id` (string, autogenerado)
    -   `magnitude` (number)
    -   `depth` (number)
    -   `location` (string)
    -   `date` (date)

-   **Clima:**
    -   `_id` (string, formato `id:clima_X`)
    -   `city` (string)
    -   `temperature` (number)
    -   `humidity` (number)
    -   `condition` (string)
    -   `date` (date)

## Notas

-   Todas las rutas devuelven errores claros en caso de parámetros faltantes o datos no encontrados.
-   El proyecto incluye pruebas automáticas con Jest y Supertest.
-   Para desarrollo local, configura las variables de entorno de MongoDB en un archivo `.env`.

## Ejecución

1. Instala dependencias:
    ```bash
    npm install
    ```
2. Ejecuta el servidor:
    ```bash
    npm start
    ```
3. Corre los tests:
    ```bash
    npm test
    ```

---

Para más detalles sobre cada endpoint, revisa los archivos de rutas en la carpeta `src/` o consulta la colección de ejemplos para Postman incluida en el repositorio.
