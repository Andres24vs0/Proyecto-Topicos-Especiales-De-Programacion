# Weather API - Endpoint POST

## 📋 Descripción
Implementación del endpoint POST `/weather` para guardar nuevos registros de clima en la base de datos.

## 🚀 Características

### **Endpoint**: `POST /weather`
- **Descripción**: Guarda un nuevo registro de clima en la base de datos
- **Headers**: `Content-Type: application/json`
- **Validaciones**: Campos requeridos, rangos válidos, condiciones permitidas

## 📊 Validaciones

### **Campos Requeridos**:
- `city` (string): Nombre de la ciudad
- `temperature` (number): Temperatura en °C
- `humidity` (number): Humedad en %
- `condition` (string): Condición climática

### **Rangos Válidos**:
- **Temperatura**: -50°C a 60°C
- **Humedad**: 0% a 100%

### **Condiciones Permitidas**:
- `Soleado`
- `Lluvioso`
- `Nublado`
- `Tormenta`

## 📝 Ejemplo de Request

```json
{
    "city": "Madrid",
    "temperature": 25,
    "humidity": 60,
    "condition": "Soleado"
}
```

## 📊 Respuestas

### **Respuesta Exitosa** (201):
```json
{
    "message": "Registro de clima guardado exitosamente",
    "data": {
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

### **Respuesta de Error** (400):
```json
{
    "error": "La condición debe ser una de: Soleado, Lluvioso, Nublado, Tormenta"
}
```

## 🧪 Pruebas

### **Con Postman**:
1. Importa `Weather_API_Postman_Collection_POST.json`
2. Ejecuta "Guardar Registro de Clima"
3. Prueba los ejemplos de datos
4. Prueba los casos de error

### **Ejemplos Incluidos**:
- Clima Soleado (Barcelona)
- Clima Lluvioso (Valencia)
- Clima Nublado (Sevilla)
- Clima Tormenta (Bilbao)

### **Casos de Error**:
- Datos Inválidos - Condición
- Datos Inválidos - Temperatura
- Datos Inválidos - Humedad
- Datos Faltantes

## 🔧 Archivos Incluidos

- `src/weatherBD.routes.POST.js` - Lógica del endpoint POST
- `server.POST.js` - Servidor específico para POST
- `Weather_API_Postman_Collection_POST.json` - Colección de Postman
- `README_POST.md` - Esta documentación

## 🚀 Ejecución

```bash
# Usar el servidor específico para POST
node server.POST.js
```

## 📝 Notas

- Validación completa de datos de entrada
- Mensajes de error descriptivos
- Manejo de errores robusto
- Respuesta con el registro guardado 