const request = require('supertest');
const app = require('../src/app');

describe('GET /health', () => {
  it('responde 200 con status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('POST /api/asistencia', () => {
  const zona = { zonaLat: -12.0464, zonaLon: -77.0428 };

  it('rechaza la solicitud si faltan campos obligatorios', async () => {
    const res = await request(app).post('/api/asistencia').send({});
    expect(res.status).toBe(400);
  });

  it('registra la asistencia si el empleado está dentro del radio permitido', async () => {
    const res = await request(app)
      .post('/api/asistencia')
      .send({ empleadoId: 'EMP-001', lat: -12.0465, lon: -77.0429, ...zona });

    expect(res.status).toBe(201);
    expect(res.body.empleadoId).toBe('EMP-001');
  });

  it('rechaza el registro si la ubicación está fuera del área permitida', async () => {
    const res = await request(app)
      .post('/api/asistencia')
      .send({ empleadoId: 'EMP-002', lat: -12.10, lon: -77.10, ...zona });

    expect(res.status).toBe(422);
  });
});
