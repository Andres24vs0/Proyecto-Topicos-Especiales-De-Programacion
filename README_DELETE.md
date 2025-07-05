# Weather API - Endpoint DELETE

## 📋 Descripción
Implementación del endpoint DELETE `/weather/:id` para eliminar registros específicos de clima usando su ID de MongoDB.

## 🚀 Características

### **Endpoint**: `DELETE /weather/:id`
- **Descripción**: Elimina un registro específico de clima usando su ID
- **Parámetros**: `id` (MongoDB ObjectId)
- **Validaciones**: Formato de ID válido, existencia del registro

## 📊 Validaciones

### **Formato de ID**:
- Debe ser un MongoDB ObjectId válido
- 24 caracteres hexadecimales
- Ejemplo: `507f1f77bcf86cd799439011`

### **Verificaciones**:
- ID debe estar presente
- ID debe tener formato válido
- Registro debe existir en la base de datos

## 📝 Ejemplo de Request

```
DELETE /weather/507f1f77bcf86cd799439011
```

## 📊 Respuestas

### **Respuesta Exitosa** (200):
```json
{
    "message": "Registro eliminado exitosamente",
    "deletedRecord": {
        "_id": "507f1f77bcf86cd799439011",
        "city": "Madrid",
        "temperature": 25,
        "humidity": 60,
        "condition": "Soleado",
        "date": "2024-01-01T12:00:00.000Z",
        "createdAt": "2024-01-01T12:00:00.000Z",
        "updatedAt": "2024-01-01T12:00:00.000Z"
    }
}
```

### **Respuesta de Error - ID Inválido** (400):
```json
{
    "error": "ID de registro inválido"
}
```

### **Respuesta de Error - No Encontrado** (404):
```json
{
    "error": "No se encontró el registro con el ID especificado"
}
```

## 🧪 Pruebas

### **Con Postman**:
1. Importa `Weather_API_Postman_Collection_DELETE.json`
2. Obtén un ID real de un registro existente
3. Actualiza la variable `record_id` con el ID real
4. Ejecuta "Eliminar Registro por ID"

### **Flujo de Pruebas**:
1. **Crear registro** con POST `/weather`
2. **Obtener ID** del registro creado
3. **Eliminar registro** con DELETE `/weather/:id`
4. **Verificar eliminación** consultando el historial

### **Casos de Error**:
- ID Inválido para Eliminar
- ID Inexistente

## 🔧 Archivos Incluidos

- `src/weatherBD.routes.DELETE.js` - Lógica del endpoint DELETE
- `server.DELETE.js` - Servidor específico para DELETE
- `Weather_API_Postman_Collection_DELETE.json` - Colección de Postman
- `README_DELETE.md` - Esta documentación

## 🚀 Ejecución

```bash
# Usar el servidor específico para DELETE
node server.DELETE.js
```

## 📝 Notas

- Validación de formato de ID de MongoDB
- Verificación de existencia del registro
- Respuesta con el registro eliminado
- Manejo de errores específicos
- Requiere ID real para pruebas efectivas

## 🔍 Obtener ID Real

Para obtener un ID real para las pruebas:

1. **Crear un registro**:
   ```bash
   POST /weather
   {
       "city": "Test",
       "temperature": 20,
       "humidity": 50,
       "condition": "Soleado"
   }
   ```

2. **Extraer el ID** de la respuesta:
   ```json
   {
       "data": {
           "_id": "507f1f77bcf86cd799439011"  // <- Este es el ID
       }
   }
   ```

3. **Usar el ID** en DELETE:
   ```bash
   DELETE /weather/507f1f77bcf86cd799439011
   ``` 