import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { UsuarioModule } from '../usuario.module'; 
import { DatabaseModule } from '../../../database/database.module';

describe('UsuarioModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, UsuarioModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/usuario (POST) - deve criar um novo usuário', async () => {
    const usuarioData = {
      idkey_tipo_usuario: 1,
      email: 'test@test.com',
      senha: 'password123',
    };

    return request(app.getHttpServer())
      .post('/usuario')
      .send(usuarioData)
      .expect(201)
      .expect((res) => {
        expect(res.body.idkey_tipo_usuario).toBe(usuarioData.idkey_tipo_usuario);
        expect(res.body.email).toBe(usuarioData.email);
      });
  });

  it('/usuario (GET) - deve retornar todos os usuários', async () => {
    return request(app.getHttpServer())
      .get('/usuario')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  
  it('/usuario/:id (GET) - deve retornar um usuário específico', async () => {
    const id = 1; 
    return request(app.getHttpServer())
      .get(`/usuario/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('email');
      });
  });

  it('/usuario/:id (PATCH) - deve atualizar um usuário específico', async () => {
    const id = 1; 
    const updateData = {
      email: 'updated@test.com',
      senha: 'newpassword123',
    };

    return request(app.getHttpServer())
      .patch(`/usuario/${id}`)
      .send(updateData)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(updateData.email);
        expect(res.body.senha).toBe(updateData.senha);
      });
  });


  // it('/usuario/:id (DELETE) - deve remover um usuário específico', async () => {
  //   const id = 1; 
  //   return request(app.getHttpServer())
  //     .delete(`/usuario/${id}`)
  //     .expect(200);
  // });
});
