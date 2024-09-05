import { Module } from '@nestjs/common';
import { TipoUsuarioService } from './tipo-usuario.service';
import { TipoUsuarioController } from './tipo-usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TipoUsuario } from './entities/tipo-usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoUsuario])],
  controllers: [TipoUsuarioController],
  providers: [TipoUsuarioService],
})
export class TipoUsuarioModule {}
