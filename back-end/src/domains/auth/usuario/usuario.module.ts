import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Imagem }           from '@domains/storage/entities/imagem.entity';
import { Usuario }          from './entities/usuario.entity';
import { UsuarioService }   from './usuario.service';
import { StorageModule }    from '@domains/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    StorageModule
  ],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule { }
