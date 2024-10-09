import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Estabelecimento } from './entities/estabelecimento.entity';
import { EstabelecimentoService } from './estabelecimento.service';
import { EstabelecimentoController } from './estabelecimento.controller';

import { UsuarioTipoModule } from '@src/auth/usuario/tipo/tipo.module';
import { UsuarioModule } from '@src/auth/usuario/usuario.module';
import { QuadraModule } from './quadra/quadra.module';

@Module({
  imports: [TypeOrmModule.forFeature([Estabelecimento]), 
    QuadraModule,
    UsuarioModule,
    UsuarioTipoModule], 
  controllers: [EstabelecimentoController],
  providers: [EstabelecimentoService],
  exports: [EstabelecimentoService],
})
export class EstabelecimentoModule {}
