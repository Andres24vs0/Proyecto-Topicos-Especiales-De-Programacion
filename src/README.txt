API RESTful para registrar y eliminar reportes sísmicos. Desarrollada con **Node.js**, **Express**, **MongoDB Atlas**, documentada con **Swagger** y testeada con **Jest + Supertest**.

Caracteristicas:
- Registro de terremotos con ID incremental personalizado
- Eliminación por ID (`DELETE /earthquakes/:id`)
- Validación de entradas
- Documentación Swagger
- Pruebas automatizadas con Jest y Supertest
- Conexión dinámica a base de datos en la nube vía MongoDB Atlas

app.js : Servidor principal y conexion MongoDB
earthquakeController.js : Logica del controlador para POST
eathquakes.js : Rutas
Earthquake.js : Modelo de Mongoose
Counter.js : Modelo de contador para IDs personalizados
validate.js : Middleware para validar entrada
swagger.json : Documentacion Swagger
deleteEarthquake.test.js : Test DELETE con Jest

Datos del .env:
MONGO_USER=admin
MONGO_PASS=viva_topicos

Elimina un reporte sísmico basado en su ID personalizado (formato: `sismo_0001`, etc).

Ejemplo de solicitud 
DELETE http://localhost:3000/earthquakes/sismo_0004

RESPUESTA 200 OK 
{
  "message": "Sismo con ID sismo_0004 eliminado"
}

NO EXISTE 404
{
  "error": "No se encontró el sismo con ID sismo_9999"
}

Para hacer test
npm install
npm test
