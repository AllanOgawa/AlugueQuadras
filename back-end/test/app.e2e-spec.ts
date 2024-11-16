import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { AppModule } from '../src/app.module';

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as clc from 'cli-color';

// testes
import auth from '../src/domains/auth/test/auth.e2e-tests';

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
});
