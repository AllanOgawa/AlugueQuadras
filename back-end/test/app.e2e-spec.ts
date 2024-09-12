import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { DatabaseModule } from '../src/database/database.module';
import { AppModule } from '../src/app.module';

describe('App E2E Tests (Ordered by Dependency)', () => {
  let app: INestApplication;

  beforeAll(async () => {
  
    // runSQLScripts();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  
  require('../src/admin/usuario/tipo/test/tipo.controller.e2e-spec');
  // require('../src/admin/usuario/test/usuario.e2e-spec');
});


