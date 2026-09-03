## Parte 2: Caso de estudio y diseño de flujo CI/CD — ClickClak Solutions

Este repositorio contiene la implementación funcional del pipeline CI/CD
diseñado para el caso de estudio **ClickClak**, un sistema de asistencia
para personal de campo (vendedores, técnicos, transportistas).

### Estructura

- `backend/` — API en Node.js + Express que registra la asistencia y
  valida la ubicación del empleado (`GET /health`, `POST /api/asistencia`).
- `backend/tests/` — pruebas automatizadas (Jest + Supertest).
- `backend/Dockerfile` — imagen multi-stage (build con esbuild + runtime).
- `scripts/deploy-simulado.sh` — levanta el contenedor generado, verifica
  `/health` y lo detiene; simula el despliegue a staging.
- `.github/workflows/ci-cd.yml` — pipeline de GitHub Actions con 4 etapas:
  compilación, pruebas automatizadas, construcción de imagen Docker y
  despliegue simulado (solo en `main`).

### Flujo de ramas

- `develop`: integración de features, dispara build + test en cada push/PR.
- `main`: rama estable; un push aquí ejecuta el pipeline completo,
  incluyendo el despliegue simulado a staging.

### Cómo correr el pipeline en local

```bash
cd backend
npm install
npm run build
npm test

cd ..
docker build -t clickclak-backend:local ./backend
bash scripts/deploy-simulado.sh clickclak-backend:local
```
