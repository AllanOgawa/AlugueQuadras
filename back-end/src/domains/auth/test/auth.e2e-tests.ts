import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export default function (getApp: () => INestApplication) {
  let app: INestApplication;
  let jwtToken: string;

  describe('AuthModule (e2e)', () => {
    beforeAll(() => {
      app = getApp();
    });

    it('/auth/register (POST) - deve criar um novo usuário', async () => {

      const usuarioData = {
        nome: 'Eduardo Richard',
        username: 'richwrd_',
        email: 'eduardorichard@gmail.com',
        senha: '123456789',
        cpf: '10937849381',
        dataNascimento: '2003-05-15',
        imagensToAdd: ['teste.png']
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(usuarioData)
        .expect(201);

      expect(response.body).toHaveProperty('idkey');
      expect(response.body.nome).toBe(usuarioData.nome);
      expect(response.body.email).toBe(usuarioData.email);
    });

    it('/auth/login (POST) - deve autenticar o usuário e retornar um token JWT', async () => {
      const loginData = {
        login: 'richwrd_',
        senha: '123456789',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      jwtToken = response.body.access_token;
    });

    it('/auth/change-password (POST) - deve alterar a senha do usuário', async () => {
      const changePasswordData = {
        senhaAtual: '123456789',
        senhaNova: '12345678910',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/change-password')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(changePasswordData)
        .expect(201);

      expect(response.body.message).toBe('Senha atualizada com sucesso.');
    });

    it('/auth/profile (GET) - deve retornar o perfil completo do usuário', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('idkey');
      expect(response.body.nome).toBe('Eduardo Richard');
    });

    it('/auth/profile (PATCH) - deve atualizar os dados do usuário', async () => {
      const updateProfileData = {
        nome: 'Eduardo Richard Atualizado',
        username: "richwrd",
        imagensToRemove: ['teste.png']
      };

      const response = await request(app.getHttpServer())
        .patch('/auth/profile/edit')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateProfileData)
        .expect(200);

      expect(response.body.nome).toBe(updateProfileData.nome);
      expect(response.body.username).toBe(updateProfileData.username);
      expect(response.body.imagens).toEqual([]); // Corrigido para verificar arrays
    });
  });
}
