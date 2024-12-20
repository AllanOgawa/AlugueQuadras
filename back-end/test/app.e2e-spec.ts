import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { AppModule } from '../src/app.module';

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as clc from 'cli-color';

// testes
import auth from '@src/domains/auth/test/auth.e2e-tests';
import tipoEsporte from '@src/domains/gestao/estabelecimento/quadra/tipo-esporte/test/tipo-esporte.e2e-tests';
import acomodacao from '@src/domains/gestao/estabelecimento/acomodacao/test/acomodacao.e2e-tests';
import estabelecimento from '@src/domains/gestao/estabelecimento/test/estabelecimento.e2e-tests';
import quadra from '@src/domains/gestao/estabelecimento/quadra/test/quadra.e2e-tests';
import reserva from '@src/domains/gestao/estabelecimento/quadra/reserva/test/reserva.e2e-tests';
import storage from '@src/domains/storage/test/storage.e2e-tests';
import horarioFuncionamento from '@src/domains/gestao/estabelecimento/horario-funcionamento/test/horario-funcionamento.e2e-tests';

const env = process.env.NODE_ENV;
const envFilePath = path.resolve(process.cwd(), `env/${env}.env`);
const result = dotenv.config({ path: envFilePath });

if (result.error) {
  console.error(clc.red(`Erro ao carregar o arquivo .env em ${envFilePath}:`), result.error);
  process.exit(1);
} else {
  console.log(clc.green(`Variáveis de ambiente carregadas a partir de ${envFilePath}`));
}

let app: INestApplication;

// Inicializar o aplicativo antes de todos os testes
beforeAll(async () => {

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
});

// Fechar o aplicativo após todos os testes
afterAll(async () => {
  await app.close();
});

describe('App E2E Tests (Ordered by Dependency)', () => {
  describe('Autenticação', () => {
    auth(() => app);
  });

  describe('Gestão', () => {
    tipoEsporte(() => app);
    acomodacao(() => app);
    estabelecimento(() => app);
    quadra(() => app);
    reserva(() => app);
    storage(() => app);
    horarioFuncionamento(() => app);
  });
});
