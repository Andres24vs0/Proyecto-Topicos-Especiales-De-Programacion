# Weather API - Endpoint GET

## 📋 Descripción
Implementación del endpoint GET `/weather/history/:city` para obtener el historial de registros climáticos de una ciudad específica.

## 🚀 Características

### **Endpoint**: `GET /weather/history/:city`
- **Descripción**: Obtiene el historial completo de registros climáticos de una ciudad
- **Parámetros**: `city` (nombre de la ciudad)
- **Orden**: Por fecha (más recientes primero)
- **Filtrado**: En navegador solo muestra campos principales, en Postman muestra todos

## 📊 Respuestas

### **En Navegador** (campos filtrados):
```json
{
    "city": "Madrid",
    "records": [
        {
            "city": "Madrid",
            "condition": "Soleado",
            "temperature": 25,
            "humidity": 60
        }
    ],
    "total": 1
}
```

### **En Postman** (campos completos):
```json
{
    "city": "Madrid",
    "records": [
        {
            "_id": "507f1f77bcf86cd799439011",
            "city": "Madrid",
            "condition": "Soleado",
            "temperature": 25,
            "humidity": 60,
            "date": "2024-01-01T12:00:00.000Z",
            "createdAt": "2024-01-01T12:00:00.000Z",
            "updatedAt": "2024-01-01T12:00:00.000Z"
        }
    ],
    "total": 1
}
```

## 🧪 Pruebas

### **Con Postman**:
1. Importa `Weather_API_Postman_Collection_GET.json`
2. Ejecuta "Obtener Historial de Ciudad"
3. Prueba con diferentes ciudades

### **En Navegador**:
- `http://localhost:3005/weather/history/Madrid`
- `http://localhost:3005/weather/history/Barcelona`

## 🔧 Archivos Incluidos

- `src/weatherBD.routes.GET.js` - Lógica del endpoint GET
- `server.GET.js` - Servidor específico para GET
- `Weather_API_Postman_Collection_GET.json` - Colección de Postman
- `README_GET.md` - Esta documentación

## 🚀 Ejecución

```bash
# Usar el servidor específico para GET
node server.GET.js
```

## 📝 Notas

- Detecta automáticamente si la petición viene del navegador
- Filtra campos automáticamente para navegador
- Mantiene respuesta completa para Postman
- Manejo de errores robusto 