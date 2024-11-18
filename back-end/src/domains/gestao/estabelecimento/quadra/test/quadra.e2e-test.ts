import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export default function (getApp: () => INestApplication) {
  let app: INestApplication;
  let jwtToken: string;
  let quadraId: number;
  let estabelecimentoId: number;
  let tipoEsporteIds: number[] = [2, 3];

  describe('QuadraModule (e2e)', () => {
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

      const estabelecimentoData = {
        cnpj: '12345678910121',
        razaoSocial: 'ESTABELECIMENTO ALUGUE QUADRAS',
        nome: 'Estabelecimento AQ',
        telefone: '44997904715',
        email: 'aluguequadras@exemplo.com.br',
        alvara: 'ALVARA-123',
        sobre: 'TESTE',
        imagensToAdd: ['estabelecimento/imagem1.jpg'],
        endereco: {
          logradouro: 'Rua das Flores',
          numero: '123',
          complemento: 'Esquina com a Rua das Rosas',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '12345678',
          latitude: '-23.550520',
          longitude: '-46.633308',
        },
        horariosFuncionamento: [
          {
            diaSemana: 1,
            horaAbertura: '06:00:00',
            horaFechamento: '22:00:00',
          },
          {
            diaSemana: 2,
            horaAbertura: '06:00:00',
            horaFechamento: '22:00:00',
          },
          {
            diaSemana: 3,
            horaAbertura: '06:00:00',
            horaFechamento: '22:00:00',
          },
          {
            diaSemana: 4,
            horaAbertura: '06:00:00',
            horaFechamento: '22:00:00',
          },
          {
            diaSemana: 5,
            horaAbertura: '06:00:00',
            horaFechamento: '22:00:00',
          },
          {
            diaSemana: 6,
            horaAbertura: '06:00:00',
            horaFechamento: '22:00:00',
          },
        ],
        acomodacoesToAdd: [2, 3],
      };

      const estabelecimentoResponse = await request(app.getHttpServer())
        .post('/estabelecimento/new')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(estabelecimentoData)
        .expect(201);

      expect(estabelecimentoResponse.body).toHaveProperty('idkey');
      expect(estabelecimentoResponse.body.nome).toBe(estabelecimentoData.nome);
      estabelecimentoId = estabelecimentoResponse.body.idkey;

    });

    it('/estabelecimento/quadra/new (POST) - deve criar uma nova quadra', async () => {
      const quadraData = {
        nome: 'Quadra Central',
        informacoesAdicionais: 'Quadra com piso de madeira e iluminação noturna.',
        valor: 150,
        largura: 5,
        comprimento: 10,
        coberta: true,
        idkeyEstabelecimento: estabelecimentoId,
        imagensToAdd: [
          'quadra/imagem122.jpg',
        ],
        tiposEsporteToAdd: tipoEsporteIds,
      };

      const response = await request(app.getHttpServer())
        .post('/estabelecimento/quadra/new')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(quadraData)
        .expect(201);

      expect(response.body).toHaveProperty('idkey');
      expect(response.body.nome).toBe(quadraData.nome);
      expect(response.body.informacoesAdicionais).toBe(quadraData.informacoesAdicionais);
      expect(Number(response.body.valor)).toEqual(Number(quadraData.valor));
      expect(Number(response.body.largura)).toEqual(Number(quadraData.largura));
      expect(Number(response.body.comprimento)).toEqual(Number(quadraData.comprimento));
      expect(response.body.coberta).toBe(quadraData.coberta);

      const addedImage = response.body.imagens.find((img) => img.path === 'quadra/imagem122.jpg');
      expect(addedImage).toBeDefined();

      const tiposEsporteIdkeys = response.body.tiposEsporte.map((tiposEsporte) => tiposEsporte.idkey);
      expect(tiposEsporteIdkeys).toContain(2);
      expect(tiposEsporteIdkeys).toContain(3);

      quadraId = response.body.idkey;
    });

    it('/estabelecimento/quadra/search/:idkey (GET) - deve buscar uma quadra por ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/estabelecimento/quadra/search/${quadraId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('idkey');
      expect(response.body.idkey).toBe(quadraId);
      expect(response.body).toHaveProperty('nome');
      expect(response.body).toHaveProperty('informacoesAdicionais');
      expect(response.body).toHaveProperty('valor');
      expect(response.body).toHaveProperty('largura');
      expect(response.body).toHaveProperty('comprimento');
      expect(response.body).toHaveProperty('coberta');
      expect(response.body).toHaveProperty('imagens');
      expect(response.body).toHaveProperty('tiposEsporte');
    });

    it('/estabelecimento/quadra/edit/:idkey (PATCH) - deve atualizar uma quadra existente', async () => {
      const updateData = {
        nome: 'Quadra Central Atualizada',
        informacoesAdicionais: 'Quadra renovada com piso sintético.',
        valor: 200,
        largura: 6,
        comprimento: 12,
        coberta: false,
        imagensToAdd: ['quadra/nova_imagem.png'],
        imagensToRemove: ['quadra/imagem122.jpg'],
        tipoEsporteToAdd: [4],
        tipoEsporteToRemove: [2],
      };

      const response = await request(app.getHttpServer())
        .patch(`/estabelecimento/quadra/edit/${quadraId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.nome).toBe(updateData.nome);
      expect(response.body.informacoesAdicionais).toBe(updateData.informacoesAdicionais);
      expect(Number(response.body.valor)).toEqual(Number(updateData.valor));
      expect(Number(response.body.largura)).toEqual(Number(updateData.largura));
      expect(Number(response.body.comprimento)).toEqual(Number(updateData.comprimento));
      expect(response.body.coberta).toBe(updateData.coberta);

      const addedImage = response.body.imagens.find((img) => img.path === 'quadra/nova_imagem.png');
      expect(addedImage).toBeDefined();

      const tiposEsporteIdkeys = response.body.tiposEsporte.map((tiposEsporte) => tiposEsporte.idkey);
      expect(tiposEsporteIdkeys).toContain(updateData.tipoEsporteToAdd[0]);
      expect(tiposEsporteIdkeys).not.toContain(updateData.tipoEsporteToRemove[0]);

    });

    it('/estabelecimento/quadra/search/tipo-esporte/:tipoEsporteId (GET) - deve buscar quadras por tipo de esporte', async () => {
      const response = await request(app.getHttpServer())
        .get(`/estabelecimento/quadra/search/tipo-esporte/${tipoEsporteIds[1]}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      response.body.forEach((quadra: any) => {
        const tiposEsporteIdkeys = quadra.tiposEsporte.map((tiposEsporte) => tiposEsporte.idkey);

        expect(tiposEsporteIdkeys).toContain(tipoEsporteIds[1]);
      });

    });

    it('/estabelecimento/quadra/remove/:idkey (DELETE) - deve remover uma quadra', async () => {
      await request(app.getHttpServer())
        .delete(`/estabelecimento/quadra/remove/${quadraId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });

  });
}
