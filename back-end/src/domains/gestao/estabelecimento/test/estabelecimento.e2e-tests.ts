import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export default function (getApp: () => INestApplication) {
  let app: INestApplication;
  let jwtToken: string;
  let estabelecimentoId: number;

  describe('EstabelecimentoModule (e2e)', () => {
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

    it('/estabelecimento/new (POST) - deve criar um novo estabelecimento', async () => {
      const estabelecimentoData = {
        cnpj: '12345678910121',
        razaoSocial: 'ESTABELECIMENTO ALUGUE QUADRAS',
        nome: 'Estabelecimento AQ',
        telefone: '44997904715',
        email: 'aluguequadras@exemplo.com.br',
        alvara: 'ALVARA-123',
        sobre: 'TESTE',
        imagensToAdd: ['31n4n41n3n1insdsnoas52dnaziw0212e.png'],
        endereco: {
          logradouro: 'Rua das Flores',
          numero: '123',
          complemento: 'Esquina com a Rua das Rosas',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '12345678',
          latitude: '-255333.5535',
          longitude: '214445.22',
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

      const response = await request(app.getHttpServer())
        .post('/estabelecimento/new')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(estabelecimentoData)
        .expect(201);

      expect(response.body).toHaveProperty('idkey');
      expect(response.body.cnpj).toBe(estabelecimentoData.cnpj);
      expect(response.body.nome).toBe(estabelecimentoData.nome);
      estabelecimentoId = response.body.idkey;

      const quadraData = {
        nome: "Quadra Central",
        informacoesAdicionais: "Quadra com piso de madeira e iluminação noturna.",
        valor: 150,
        largura: 5,
        comprimento: 10,
        coberta: true,
        idkeyEstabelecimento: estabelecimentoId,
        imagensToAdd: [
          "quadra/imagem.jpg"
        ],
        tiposEsporteToAdd: [
          2,
          3
        ]
      }

      await request(app.getHttpServer())
        .post('/estabelecimento/quadra/new')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(quadraData)
        .expect(201);
    });

    it('/estabelecimento/list (GET) - deve listar todos os estabelecimentos', async () => {
      const response = await request(app.getHttpServer())
        .get('/estabelecimento/list')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('/estabelecimento/search (GET) - deve buscar estabelecimentos com critérios', async () => {
      const nome = 'Estabelecimento AQ';

      const response = await request(app.getHttpServer())
        .get(`/estabelecimento/search?nome=${encodeURIComponent(nome)}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('/estabelecimento/usuario (GET) - deve listar todos os estabelecimentos do usuário', async () => {
      const response = await request(app.getHttpServer())
        .get('/estabelecimento/usuario')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('/estabelecimento/:idkey/quadras (GET) - deve listar todas as quadras de um estabelecimento', async () => {
      const response = await request(app.getHttpServer())
        .get(`/estabelecimento/${estabelecimentoId}/quadras`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((quadra: any) => {
        expect(quadra).toHaveProperty('idkey');
        expect(quadra).toHaveProperty('nome');
      });
    });

    it('/estabelecimento/edit/:idkey (PATCH) - deve atualizar um estabelecimento existente', async () => {
      const updateData = {
        nome: 'Estabelecimento AQ Atualizado',
        telefone: '44998877665',
        email: 'contato@estabelecimentoaq.com.br',
        sobre: 'ATUALIZAÇÃO DE TESTE',
        imagensToAdd: ['nova_imagem.png'],
        imagensToRemove: ['31n4n41n3n1insdsnoas52dnaziw0212e.png'],
        acomodacoesToAdd: [4],
        acomodacoesToRemove: [2],
        endereco: {
          logradouro: 'Avenida Central',
          numero: '456',
          complemento: 'Próximo ao Shopping',
          bairro: 'Jardins',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '87654321',
          latitude: '-255333.5555',
          longitude: '214445.55',
        },
        horariosFuncionamento: [
          {
            diaSemana: 1,
            horaAbertura: '07:00:00',
            horaFechamento: '21:00:00',
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
        ],
      };

      const response = await request(app.getHttpServer())
        .patch(`/estabelecimento/edit/${estabelecimentoId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.nome).toBe(updateData.nome);
      expect(response.body.telefone).toBe(updateData.telefone);
      expect(response.body.email).toBe(updateData.email);
      expect(response.body.sobre).toBe(updateData.sobre);

      const addedImage = response.body.imagens.find((img) => img.path === 'nova_imagem.png');
      expect(addedImage).toBeDefined();

      const acomodacoesIdkeys = response.body.acomodacoes.map((acomodacao) => acomodacao.idkey);

      expect(acomodacoesIdkeys).toContain(4);
      expect(acomodacoesIdkeys).not.toContain(2);

      expect(response.body.endereco.logradouro).toBe(updateData.endereco.logradouro);
      expect(response.body.endereco.numero).toBe(updateData.endereco.numero);
    });

    it('/estabelecimento/remove/:idkey (DELETE) - deve remover um estabelecimento', async () => {
      await request(app.getHttpServer())
        .delete(`/estabelecimento/remove/${estabelecimentoId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });

    // it('/estabelecimento/tipo-esporte/:tipoEsporteId (GET) - deve buscar estabelecimentos por tipo de esporte', async () => {
    //   const tipoEsporteId = 2;

    //   const response = await request(app.getHttpServer())
    //     .get(`/estabelecimento/tipo-esporte/${tipoEsporteId}`)
    //     .expect(200);

    //   expect(Array.isArray(response.body)).toBe(true);
    //   response.body.forEach((estabelecimento: any) => {
    //     expect(estabelecimento).toHaveProperty('idkey');
    //     expect(estabelecimento).toHaveProperty('nome');
    //   });
    // });
  });
}
