import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as pg from 'pg';
import { entities } from './entities';

// Ao receber um bigint, ao invez de devolver como string permanece number
pg.types.setTypeParser(20, (val) => parseInt(val, 10));  

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host:     configService.get<string>('DB_HOST'),
        port:     configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: entities,
        synchronize: true,  // Cria as tabelas automaticamente
        logging: false,
      }),
    }),
  ],
})
export class DatabaseModule {}