import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export default function (getApp: () => INestApplication) {
  let app: INestApplication;
  let jwtToken: string;
  let acomodacaoId: number;

  describe('AcomodacaoModule (e2e)', () => {
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

    it('/estabelecimento/acomodacao/new (POST) - deve criar uma nova acomodação', async () => {
      const acomodacaoData = {
        descricao: 'CADEIRAdNTE',
        icone: 'icone_cadeirante',
      };

      const response = await request(app.getHttpServer())
        .post('/estabelecimento/acomodacao/new')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(acomodacaoData)
        .expect(201);

      expect(response.body).toHaveProperty('idkey');
      expect(response.body.descricao).toBe(acomodacaoData.descricao);
      expect(response.body.icone).toBe(acomodacaoData.icone);
      acomodacaoId = response.body.idkey;
    });

    it('/estabelecimento/acomodacao/new/array (POST) - deve criar múltiplas Acomodações', async () => {
      const acomodacoesArray = {
        acomodacoes: [
          {
            descricao: 'WIFI',
            icone: 'icone_wifi.png',
          },
          {
            descricao: 'BAR',
            icone: 'icone_bar',
          },
          {
            descricao: 'BANHEIRO',
            icone: 'icone_banheiro',
          },
          {
            descricao: 'PET',
            icone: 'icone_pet',
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/estabelecimento/acomodacao/new/array')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(acomodacoesArray)
        .expect(201);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(4);
      response.body.forEach((acomodacao: any, index: number) => {
        expect(acomodacao).toHaveProperty('idkey');
        expect(acomodacao.descricao).toBe(acomodacoesArray.acomodacoes[index].descricao);
        expect(acomodacao.icone).toBe(acomodacoesArray.acomodacoes[index].icone);
      });
    });

    it('/estabelecimento/acomodacao/list (GET) - deve listar todas as Acomodações', async () => {
      const response = await request(app.getHttpServer())
        .get('/estabelecimento/acomodacao/list')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      response.body.forEach((acomodacao: any) => {
        expect(acomodacao).toHaveProperty('idkey');
        expect(acomodacao).toHaveProperty('descricao');
        expect(acomodacao).toHaveProperty('icone');
      });
    });

    it('/estabelecimento/acomodacao/search/:idkey (GET) - deve buscar uma Acomodação por ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/estabelecimento/acomodacao/search/${acomodacaoId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('idkey');
      expect(response.body.idkey).toBe(Number(acomodacaoId));
      expect(response.body).toHaveProperty('descricao');
      expect(response.body).toHaveProperty('icone');
    });

    it('/estabelecimento/acomodacao/edit/:idkey (PATCH) - deve atualizar uma Acomodação existente', async () => {
      const updateData = {
        descricao: 'CADEIRANTE',
      };

      const response = await request(app.getHttpServer())
        .patch(`/estabelecimento/acomodacao/edit/${acomodacaoId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.descricao).toBe(updateData.descricao);
    });

    it('/estabelecimento/acomodacao/remove/:idkey (DELETE) - deve remover uma Acomodação', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/estabelecimento/acomodacao/remove/${acomodacaoId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });
  });
}
