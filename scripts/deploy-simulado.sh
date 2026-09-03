#!/usr/bin/env bash
# Simula el despliegue del backend de ClickClak en un entorno de staging:
# levanta el contenedor recién construido, verifica que responda con /health
# y lo detiene. Sirve como evidencia de que la imagen generada es desplegable,
# sin depender de un servidor real (no disponible en este proyecto académico).
set -euo pipefail

IMAGE_TAG="${1:-clickclak-backend:local}"
CONTAINER_NAME="clickclak-staging"

echo "== Despliegue simulado: iniciando contenedor de staging =="
docker run -d --rm --name "$CONTAINER_NAME" -p 3000:3000 "$IMAGE_TAG"

cleanup() {
  echo "== Deteniendo contenedor de staging =="
  docker stop "$CONTAINER_NAME" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "== Esperando a que el servicio esté disponible =="
for i in $(seq 1 10); do
  if curl -sf http://localhost:3000/health >/dev/null; then
    echo "== Servicio disponible =="
    break
  fi
  sleep 1
done

echo "== Verificando /health =="
curl -sf http://localhost:3000/health

echo ""
echo "== Despliegue simulado exitoso en entorno de staging =="
