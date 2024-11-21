// horario-funcionamento.e2e-spec.ts

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export default function (getApp: () => INestApplication) {
  let app: INestApplication;
  let jwtToken: string;
  let estabelecimentoId: number;

  describe('HorarioFuncionamentoModule (e2e)', () => {
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

    it('/estabelecimento/:idkey/horario-funcionamento (GET) - deve obter todos os horários de funcionamento de um estabelecimento', async () => {

      const estabelecimentoData = {
        cnpj: '12345678910122',
        razaoSocial: 'ESTABELECIMENTO ALUGUE QUADRAS HORARIO FUNCIONAMENTO',
        nome: 'Estabelecimento AAQ',
        telefone: '44997904015',
        email: 'aluguequadrass@exemplo.com.br',
        alvara: 'ALVARA-1234',
        sobre: 'TESTE',
        imagensToAdd: ['estabelecimento/imagem2.jpg'],
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

      const response = await request(app.getHttpServer())
        .get(`/estabelecimento/${estabelecimentoId}/horario-funcionamento`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      response.body.forEach((horario: any) => {
        expect(horario).toHaveProperty('idkey');
        expect(horario).toHaveProperty('diaSemana');
        expect(horario).toHaveProperty('horaAbertura');
        expect(horario).toHaveProperty('horaFechamento');
      });
    });

  });
}
