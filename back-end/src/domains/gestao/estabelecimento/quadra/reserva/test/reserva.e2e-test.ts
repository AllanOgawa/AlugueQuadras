import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export default function (getApp: () => INestApplication) {
  let app: INestApplication;
  let jwtToken: string;
  let reservaId: number;
  let estabelecimentoId: number;
  let tipoEsporteIds: number[] = [2, 3];
  let quadraId: number;

  describe('ReservaModule (e2e)', () => {
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

    it('/estabelecimento/quadra/reserva/new (POST) - deve criar uma nova reserva', async () => {

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
            horaAbertura: '08:00:00',
            horaFechamento: '22:00:00',
          },
          {
            diaSemana: 2,
            horaAbertura: '08:00:00',
            horaFechamento: '22:00:00',
          },
          {
            diaSemana: 3,
            horaAbertura: '08:00:00',
            horaFechamento: '22:00:00',
          },
          {
            diaSemana: 4,
            horaAbertura: '08:00:00',
            horaFechamento: '22:00:00',
          },
          {
            diaSemana: 5,
            horaAbertura: '08:00:00',
            horaFechamento: '22:00:00',
          },
          {
            diaSemana: 6,
            horaAbertura: '08:00:00',
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

      const quadraData = {
        nome: 'Quadra Principal',
        informacoesAdicionais: 'Quadra de alto nível para competições.',
        valor: 200,
        largura: 6,
        comprimento: 12,
        coberta: true,
        idkeyEstabelecimento: estabelecimentoId,
        imagensToAdd: ['quadra/imagem_teste.jpg'],
        tiposEsporteToAdd: tipoEsporteIds,
      };

      const quadraResponse = await request(app.getHttpServer())
        .post('/estabelecimento/quadra/new')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(quadraData)
        .expect(201);

      expect(quadraResponse.body).toHaveProperty('idkey');
      expect(quadraResponse.body.nome).toBe(quadraData.nome);
      quadraId = quadraResponse.body.idkey;

      const reservaData = {
        dataInicio: "2024-11-29T13:00:00.000Z",
        dataFim: "2024-11-29T15:00:00.000Z",
        idkeyQuadra: quadraId,
      };

      const response = await request(app.getHttpServer())
        .post('/estabelecimento/quadra/reserva/new')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(reservaData)
        .expect(201);

      expect(response.body).toHaveProperty('idkey');
      expect(new Date(response.body.dataInicio).toISOString()).toBe(reservaData.dataInicio);
      expect(new Date(response.body.dataFim).toISOString()).toBe(reservaData.dataFim);
      expect(response.body.quadra.idkey).toBe(reservaData.idkeyQuadra);
      expect(response.body.usuario).toHaveProperty('idkey');
      expect(response.body.cancelada).toBe(false);
      reservaId = response.body.idkey;
    });

    it('/estabelecimento/quadra/reserva/list (GET) - deve listar todas as reservas do usuário autenticado', async () => {

      const response = await request(app.getHttpServer())
        .get('/estabelecimento/quadra/reserva/list')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      response.body.forEach((reserva: any) => {
        expect(reserva).toHaveProperty('idkey');
        expect(reserva).toHaveProperty('dataInicio');
        expect(reserva).toHaveProperty('dataFim');
        expect(reserva).toHaveProperty('quadra');
        expect(reserva.quadra).toHaveProperty('idkey');
        expect(reserva.cancelada).toBe(false);
      });

    });

    it('/estabelecimento/quadra/reserva/list-by-estabelecimento/:estabelecimentoId (GET) - deve listar todas as reservas de um estabelecimento', async () => {

      const response = await request(app.getHttpServer())
        .get(`/estabelecimento/quadra/reserva/list-by-estabelecimento/${estabelecimentoId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

    });

    it('/estabelecimento/quadra/reserva/cancelar/:idkey (PATCH) - deve cancelar uma reserva por ID', async () => {

      const response = await request(app.getHttpServer())
        .patch(`/estabelecimento/quadra/reserva/cancelar/${reservaId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      const listResponse = await request(app.getHttpServer())
        .get(`/estabelecimento/quadra/reserva/list-by-estabelecimento/${estabelecimentoId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      const reservaCancelada = listResponse.body.find((reserva) => reserva.idkey === Number(reservaId));
      expect(reservaCancelada).toBeDefined();
      expect(reservaCancelada.cancelada).toBe(true);

    });

    it('/estabelecimento/quadra/reserva/quadra/:quadraIdkey/available-slots (GET) - deve listar horários disponíveis para uma quadra específica', async () => {

      const response = await request(app.getHttpServer())
        .get(`/estabelecimento/quadra/reserva/quadra/${quadraId}/available-slots`)
        .expect(200);

      response.body.forEach((slot: any) => {
        expect(slot).toHaveProperty('data');
        expect(slot).toHaveProperty('horas');
      });

    });
  });
}
