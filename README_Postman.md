# Guía de Postman para Weather API - Completa

## 📋 Descripción
Esta guía te ayudará a configurar y usar Postman para probar todos los endpoints de tu API de clima con base de datos MongoDB.

## 🚀 Configuración Inicial

### 1. Instalar Postman
- Descarga Postman desde: https://www.postman.com/downloads/
- Instala y crea una cuenta gratuita

### 2. Importar la Colección
1. Abre Postman
2. Haz clic en "Import" (botón en la esquina superior izquierda)
3. Selecciona el archivo `Weather_API_Postman_Collection.json`
4. La colección se importará automáticamente

### 3. Configurar Variables de Entorno
La colección usa variables para facilitar las pruebas:

- **base_url**: `http://localhost:3005` (URL de tu servidor)
- **city_name**: `Madrid` (ciudad por defecto para las pruebas)
- **record_id**: `507f1f77bcf86cd799439011` (ID de ejemplo para eliminar registros)

Para cambiar estas variables:
1. Haz clic en el ícono de engranaje (⚙️) en la esquina superior derecha
2. Selecciona "Edit" en la colección
3. Ve a la pestaña "Variables"
4. Modifica los valores según necesites

## 📊 Endpoints Disponibles

### 1. Información de la API
- **Método**: GET
- **URL**: `{{base_url}}/`
- **Descripción**: Obtiene información general de la API y endpoints disponibles

### 2. Guardar Registro de Clima
- **Método**: POST
- **URL**: `{{base_url}}/weather`
- **Headers**: `Content-Type: application/json`
- **Body** (JSON):
```json
{
    "city": "Madrid",
    "temperature": 25,
    "humidity": 60,
    "condition": "Soleado"
}
```

**Condiciones válidas**: `Soleado`, `Lluvioso`, `Nublado`, `Tormenta`
**Rangos válidos**:
- Temperatura: -50°C a 60°C
- Humedad: 0% a 100%

### 3. Obtener Historial de Ciudad
- **Método**: GET
- **URL**: `{{base_url}}/weather/history/{{city_name}}`
- **Descripción**: Obtiene el historial completo de registros climáticos de una ciudad específica
- **Parámetros**: 
  - `city_name`: Nombre de la ciudad (ej: Madrid, Barcelona, Valencia)

### 4. Eliminar Registro por ID
- **Método**: DELETE
- **URL**: `{{base_url}}/weather/{{record_id}}`
- **Descripción**: Elimina un registro específico de clima usando su ID
- **Parámetros**: 
  - `record_id`: ID del registro a eliminar (formato MongoDB ObjectId)

## 🧪 Casos de Prueba Incluidos

### Ejemplos de Datos
La colección incluye ejemplos predefinidos para cada condición climática:
- **Clima Soleado**: Barcelona, 28°C, 45% humedad
- **Clima Lluvioso**: Valencia, 18°C, 85% humedad
- **Clima Nublado**: Sevilla, 22°C, 70% humedad
- **Clima Tormenta**: Bilbao, 15°C, 95% humedad

### Ejemplos de Ciudades
También incluye ejemplos para consultar historiales:
- **Historial de Madrid**: `GET /weather/history/Madrid`
- **Historial de Barcelona**: `GET /weather/history/Barcelona`
- **Historial de Valencia**: `GET /weather/history/Valencia`
- **Historial de Sevilla**: `GET /weather/history/Sevilla`

### Casos de Error
Incluye casos para probar la validación:
- **Datos Inválidos - Condición**: Condición no válida ("Ventoso")
- **Datos Inválidos - Temperatura**: Temperatura fuera de rango (100°C)
- **Datos Inválidos - Humedad**: Humedad fuera de rango (150%)
- **Datos Faltantes**: Campos requeridos faltantes
- **ID Inválido para Eliminar**: ID con formato incorrecto

## 🔄 Flujo de Pruebas Recomendado

1. **Iniciar el servidor**:
   ```bash
   npm start
   ```

2. **Verificar que la API esté funcionando**:
   - Ejecutar "Información de la API"

3. **Probar casos exitosos**:
   - Ejecutar los ejemplos de "Ejemplos de Datos" para crear registros
   - Probar "Obtener Historial de Ciudad" para verificar que se guardaron

4. **Probar casos de error**:
   - Ejecutar los casos de "Casos de Error" para verificar validaciones

5. **Probar eliminación**:
   - Obtener un ID de registro del historial
   - Actualizar la variable `record_id` con un ID real
   - Ejecutar "Eliminar Registro por ID"
   - Verificar que se eliminó consultando el historial

## 📝 Respuestas Esperadas

### Respuesta Exitosa (POST)
```json
{
    "message": "Registro de clima guardado exitosamente",
    "data": {
        "_id": "...",
        "city": "Madrid",
        "temperature": 25,
        "humidity": 60,
        "condition": "Soleado",
        "date": "2024-01-01T12:00:00.000Z"
    }
}
```

### Respuesta Exitosa (GET)
```json
{
    "city": "Madrid",
    "records": [
        {
            "_id": "...",
            "city": "Madrid",
            "temperature": 25,
            "humidity": 60,
            "condition": "Soleado",
            "date": "2024-01-01T12:00:00.000Z"
        }
    ],
    "total": 1
}
```

### Respuesta Exitosa (DELETE)
```json
{
    "message": "Registro eliminado exitosamente",
    "deletedRecord": {
        "_id": "...",
        "city": "Madrid",
        "temperature": 25,
        "humidity": 60,
        "condition": "Soleado",
        "date": "2024-01-01T12:00:00.000Z"
    }
}
```

### Respuesta de Error
```json
{
    "error": "La condición debe ser una de: Soleado, Lluvioso, Nublado, Tormenta"
}
```

## 🛠️ Consejos Útiles

1. **Cambiar ciudad de prueba**: Modifica la variable `city_name` en las variables de la colección
2. **Obtener ID real para eliminar**: 
   - Primero crea un registro con POST
   - Luego consulta el historial para obtener el ID
   - Actualiza la variable `record_id` con el ID real
3. **Ver respuestas**: Todas las respuestas se muestran en la pestaña "Response" de Postman
4. **Guardar respuestas**: Puedes guardar las respuestas exitosas para referencia futura
5. **Automatizar**: Usa la función "Runner" de Postman para ejecutar múltiples pruebas en secuencia

## 🔧 Solución de Problemas

### Error de Conexión
- Verifica que el servidor esté corriendo en `http://localhost:3005`
- Revisa que no haya errores en la consola del servidor

### Error de Base de Datos
- Verifica que MongoDB esté conectado
- Revisa las variables de entorno en tu archivo `.env`

### Error de CORS
- El servidor ya tiene CORS configurado, pero si tienes problemas, verifica la configuración

### ID Inválido para Eliminar
- Asegúrate de usar un ID válido de MongoDB (24 caracteres hexadecimales)
- Obtén el ID real de una respuesta de GET o POST

## 📞 Soporte
Si tienes problemas con la configuración o las pruebas, revisa:
1. Los logs del servidor
2. La consola del navegador (si usas Postman web)
3. La documentación de Postman: https://learning.postman.com/ 