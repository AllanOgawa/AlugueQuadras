import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { UsuarioTipoModule } from '../tipo.module'; 
import { DatabaseModule } from '../../../../database/database.module';

describe('UsuarioTipoModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, UsuarioTipoModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  
  it('/usuario/tipo (POST) - deve criar um novo tipo de usuário', async () => {
    const tipoUsuarioData = {
      descricao: 'Teste',
    };

    return request(app.getHttpServer())
      .post('/usuario/tipo')
      .send(tipoUsuarioData)
      .expect(201)
      .expect((res) => {
        expect(res.body.descricao).toBe(tipoUsuarioData.descricao);
      });
  });

  it('/usuario/tipo (GET) - deve retornar todos os tipos de usuário', async () => {
    return request(app.getHttpServer())
      .get('/usuario/tipo')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/usuario/tipo/:id (GET) - deve retornar um tipo de usuário específico', async () => {
    const id = 1;
    return request(app.getHttpServer())
      .get(`/usuario/tipo/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('descricao');
      });
  });

  it('/usuario/tipo/:id (PATCH) - deve atualizar um tipo de usuário específico', async () => {
    const id = 1;
    const updateData = {
      descricao: 'Teste Atualizado',
    };

    return request(app.getHttpServer())
      .patch(`/usuario/tipo/${id}`)
      .send(updateData)
      .expect(200)
      .expect((res) => {
        expect(res.body.descricao).toBe(updateData.descricao);
      });
  });

  // it('/usuario/tipo/:id (DELETE) - deve remover um tipo de usuário específico', async () => {
  //   const id = 1; 
  //   return request(app.getHttpServer())
  //     .delete(`/usuario/tipo/${id}`)
  //     .expect(200);
  // });
});
