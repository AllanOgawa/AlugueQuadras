import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { Imagem } from './entities/imagem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Imagem]),
    ConfigModule,
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [
    TypeOrmModule,
    StorageService
  ],
})
export class StorageModule { }
