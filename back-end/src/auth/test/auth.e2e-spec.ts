import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { AuthModule } from '../auth.module';
import { DatabaseModule } from '@database/database.module';

describe('AuthModule (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) - deve criar um novo usuário', async () => {
    const usuarioTipoData = {
      descricao: "COMUM"
    };

    /* solucao temporaria até inserirmos esses dados como enums no banco de dados ao levantar o back-end*/
    const tipoResponse = await request(app.getHttpServer())
    .post('/auth/usuario/tipo')
    .send(usuarioTipoData)
    .expect(201);

    expect(tipoResponse.body).toHaveProperty('idkey');
    expect(tipoResponse.body.descricao).toBe(usuarioTipoData.descricao);
    const usuarioTipoIdkey = tipoResponse.body.idkey;

    const usuarioData = {
      tipo: Number(usuarioTipoIdkey),
      nome: 'Eduardo Richard',
      username: 'richwrd_',
      email: 'eduardorichard@gmail.com',
      senha: 'strongpassssword123',
      cpf: '109378493-81',
      data_nascimento: '2024-08-09',
    };

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(usuarioData)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('idkey');
        expect(res.body.nome).toBe(usuarioData.nome);
        expect(res.body.email).toBe(usuarioData.email);
      });
  });

  it('/auth/login (POST) - deve autenticar o usuário e retornar um token JWT', async () => {
    const loginData = {
      login: 'richwrd_',
      senha: 'strongpassssword123',
    };

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginData)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
        jwtToken = res.body.access_token;
      });
  });

  it('/auth/change-password (POST) - deve alterar a senha do usuário', async () => {
    const changePasswordData = {
      senhaAtual: 'strongpassssword123',
      senhaNova: 'strongpassssword1234',
    };

    return request(app.getHttpServer())
      .post('/auth/change-password')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(changePasswordData)
      .expect(201)
      .expect((res) => {
        expect(res.body.message).toBe('Senha atualizada com sucesso.');
      });
  });

  it('/auth/profile (GET) - deve retornar o perfil completo do usuário', async () => {
    return request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('idkey');
        expect(res.body.nome).toBe('Eduardo Richard');
      });
  });

  it('/auth/profile (PATCH) - deve atualizar os dados do usuário', async () => {
    const updateProfileData = {
      nome: 'Eduardo Richard Atualizado',
    };

    return request(app.getHttpServer())
      .patch('/auth/profile')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updateProfileData)
      .expect(200)
      .expect((res) => {
        expect(res.body.nome).toBe(updateProfileData.nome);
      });
  });
});
