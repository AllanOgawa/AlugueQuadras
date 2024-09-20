import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { EstabelecimentoModule} from '../estabelecimento.module';
import { DatabaseModule } from '../../../../database/database.module';

describe('EstabelecimentoModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, EstabelecimentoModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/estabelecimento (POST) - deve criar um novo estabelecimento', async () => {
    const estabelecimentoData = {
        cnpj: '11111111111111',
        razao_social: 'password123',
        nome_fantasia: 'nomfantasia',
        alvara:'11111111111111',
        dat


    };
    return request(app.getHttpServer())
      .post('./estabelecimento')
      .send(estabelecimentoData)
      .expect(201)
      expect((res) => {
        expect(res.body.idkey).toBe(estabelecimentoData.idkey);
        expect(res.body.razao_social).toBe(estabelecimentoData.razao_social);
        expect(res.body.nome_fantasia).toBe(estabelecimentoData.nome_fantasia);
        expect(res.body.alvara).toBe(estabelecimentoData.alvara);

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
