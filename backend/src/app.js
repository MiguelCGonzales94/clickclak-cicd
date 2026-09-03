const express = require('express');

const app = express();
app.use(express.json());

// Radio de tolerancia (metros) para validar que el registro se hizo
// dentro del área de trabajo asignada. Simplificación con fórmula
// de distancia euclidiana en grados, suficiente para esta demo.
const RADIO_MAXIMO_METROS = 500;

function distanciaAproximadaMetros(lat1, lon1, lat2, lon2) {
  const metrosPorGrado = 111320;
  const dx = (lon2 - lon1) * metrosPorGrado;
  const dy = (lat2 - lat1) * metrosPorGrado;
  return Math.sqrt(dx * dx + dy * dy);
}

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/asistencia', (req, res) => {
  const { empleadoId, lat, lon, zonaLat, zonaLon } = req.body;

  if (!empleadoId || lat === undefined || lon === undefined) {
    return res.status(400).json({ error: 'empleadoId, lat y lon son obligatorios' });
  }

  const distancia = distanciaAproximadaMetros(lat, lon, zonaLat, zonaLon);
  if (distancia > RADIO_MAXIMO_METROS) {
    return res.status(422).json({
      error: 'Ubicación fuera del área permitida',
      distanciaMetros: Math.round(distancia),
    });
  }

  return res.status(201).json({
    empleadoId,
    registradoEn: new Date().toISOString(),
    distanciaMetros: Math.round(distancia),
  });
});

module.exports = app;
