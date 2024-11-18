import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as pg from 'pg';
import { entities } from './entities';

pg.types.setTypeParser(20, (val) => parseInt(val, 10)); // Configura o TypeParser para bigint como number

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbHost = configService.get<string>('DB_HOST');
        const dbPort = configService.get<number>('DB_PORT');
        const dbUsername = configService.get<string>('DB_USERNAME');
        const dbPassword = configService.get<string>('DB_PASSWORD');
        const dbName = configService.get<string>('DB_NAME');
        return {
          type: 'postgres',
          host: dbHost,
          port: dbPort,
          username: dbUsername,
          password: dbPassword,
          database: dbName,
          entities: entities,
          synchronize: true, // Habilita synchronize apenas se não for produção
          logging: false,
          timezone: 'Z',
        };
      },
    }),
  ],
})
export class DatabaseModule { }