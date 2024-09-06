import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { entities } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TEST_DB_HOST || 'localhost', // Host de teste
      port: parseInt(process.env.TEST_DB_PORT, 10) || 5432,
      username: process.env.TEST_DB_USERNAME || 'test',
      password: process.env.TEST_DB_PASSWORD || 'test',
      database: process.env.TEST_DB_NAME || 'test_db', 
      entities: entities,   // Adicione mais entidades conforme necessário
      synchronize: true,   // Em produção, isso geralmente é false
    }),
  ],
})
export class DatabaseTestModule {}
