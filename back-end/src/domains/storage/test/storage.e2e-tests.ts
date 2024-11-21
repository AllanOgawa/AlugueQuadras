import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export default function (getApp: () => INestApplication) {
  let app: INestApplication;
  let jwtToken: string;

  describe('StorageModule (e2e)', () => {
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

    it('/storage/upload-url (POST) - deve gerar uma URL pré-assinada para upload', async () => {
      const uploadData = {
        pathName: 'public-storage',
        fileName: 'uploads/test-image.png',
        mimeType: 'image/png',
      };

      const response = await request(app.getHttpServer())
        .post('/storage/upload-url')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(uploadData)
        .expect(201);

      expect(response.body).toHaveProperty('url');
      expect(response.body).toHaveProperty('fields');
      expect(typeof response.body.url).toBe('string');
      expect(typeof response.body.fields).toBe('object');
    });

    it('/storage/upload-url (POST) - deve retornar erro ao tentar sem autenticação', async () => {
      const uploadData = {
        pathName: 'public-storage',
        fileName: 'uploads/test-image.png',
        mimeType: 'image/png',
      };

      const response = await request(app.getHttpServer())
        .post('/storage/upload-url')
        .send(uploadData) // Sem Authorization
        .expect(401);

      expect(response.body).toHaveProperty('message', "Unauthorized");
    });
  });
}
