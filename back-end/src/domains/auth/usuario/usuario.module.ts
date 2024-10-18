import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Usuario }          from './entities/usuario.entity';
import { UsuarioService }   from './usuario.service';
import { ImagemModule }     from '@src/domains/storage/imagem/imagem.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    ImagemModule
  ],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule { }
