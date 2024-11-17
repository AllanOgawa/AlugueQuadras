import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export default function (getApp: () => INestApplication) {
  let app: INestApplication;
  let jwtToken: string;
  let tipoEsporteId: number;

  describe('TipoEsporteModule (e2e)', () => {
    beforeAll(async () => {
      app = getApp();

      const loginData = {
        login: 'richwrd',
        senha: '12345678910',
      };

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(201);

      expect(loginResponse.body).toHaveProperty('access_token');
      jwtToken = loginResponse.body.access_token;
    });

    it('/estabelecimento/quadra/tipo-esporte/new (POST) - deve criar um novo Tipo de Esporte', async () => {
      const tipoEsporteData = {
        descricao: 'Futsaal',
      };

      const response = await request(app.getHttpServer())
        .post('/estabelecimento/quadra/tipo-esporte/new')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(tipoEsporteData)
        .expect(201);

      expect(response.body).toHaveProperty('idkey');
      expect(response.body.descricao).toBe(tipoEsporteData.descricao);
      tipoEsporteId = response.body.idkey;
    });

    it('/estabelecimento/quadra/tipo-esporte/new/array (POST) - deve criar múltiplos Tipos de Esporte', async () => {
      const tiposEsporteArray = {
        tiposEsporte: [
          { descricao: 'Futebol' },
          { descricao: 'Basquete' },
          { descricao: 'Vôlei' },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/estabelecimento/quadra/tipo-esporte/new/array')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(tiposEsporteArray)
        .expect(201);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
      response.body.forEach((tipo: any, index: number) => {
        expect(tipo).toHaveProperty('idkey');
        expect(tipo.descricao).toBe(tiposEsporteArray.tiposEsporte[index].descricao);
      });
    });

    it('/estabelecimento/quadra/tipo-esporte/list (GET) - deve listar todos os Tipos de Esporte', async () => {
      const response = await request(app.getHttpServer())
        .get('/estabelecimento/quadra/tipo-esporte/list')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('/estabelecimento/quadra/tipo-esporte/edit/:idkey (PUT) - deve atualizar um Tipo de Esporte existente', async () => {
      const updateData = {
        descricao: 'Futsal',
      };

      const response = await request(app.getHttpServer())
        .put(`/estabelecimento/quadra/tipo-esporte/edit/${tipoEsporteId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.descricao).toBe(updateData.descricao);
    });

    it('/estabelecimento/quadra/tipo-esporte/remove/:idkey (DELETE) - deve remover um Tipo de Esporte', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/estabelecimento/quadra/tipo-esporte/remove/${tipoEsporteId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Tipo de Esporte deletado com sucesso');
    });
  });
}
