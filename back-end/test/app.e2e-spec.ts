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


  describe('Autenticação', () => {
    require('../src/auth/test/auth.e2e-spec');
  });
  

});