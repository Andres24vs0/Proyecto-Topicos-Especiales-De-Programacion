# Script para probar la API de clima
Write-Host "Probando API de clima..." -ForegroundColor Green

# Datos del clima
$body = @{
    city = "Barcelona"
    temperature = 50
    humidity = 85
    condition = "Lluvioso"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3005/weather/db" -Method POST -ContentType "application/json" -Body $body
    Write-Host "✅ Éxito!" -ForegroundColor Green
    Write-Host "Respuesta:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
} 