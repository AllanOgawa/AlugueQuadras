import { Module } from '@nestjs/common';
import { UsuarioTipoService } from './tipo.service';
import { UsuarioTipoController } from './tipo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuarioTipo } from './entities/tipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioTipo])],
  controllers: [UsuarioTipoController],
  providers: [UsuarioTipoService],
})
export class UsuarioTipoModule {}
