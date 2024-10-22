import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StorageService }     from './storage.service';
import { StorageController }  from './storage.controller';
import { ImagemModule }       from './imagem/imagem.module';

@Module({
  imports: [
    ConfigModule,
    ImagemModule,
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule { }
