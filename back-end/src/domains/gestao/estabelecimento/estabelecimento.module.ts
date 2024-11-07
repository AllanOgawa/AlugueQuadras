import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Estabelecimento } from './entities/estabelecimento.entity';
import { EstabelecimentoService } from './estabelecimento.service';
import { EstabelecimentoController } from './estabelecimento.controller';

import { QuadraModule } from './quadra/quadra.module';
import { UsuarioModule } from '@src/domains/auth/usuario/usuario.module';
import { ImagemModule } from '@src/domains/storage/imagem/imagem.module';
import { EnderecoModule } from '@src/domains/geral/endereco/endereco.module';
import { HorarioFuncionamentoModule } from './horario-funcionamento/horario-funcionamento.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Estabelecimento]),
    QuadraModule,
    UsuarioModule,
    ImagemModule,
    EnderecoModule,
    HorarioFuncionamentoModule
  ],
  controllers: [EstabelecimentoController],
  providers: [EstabelecimentoService],
  exports: [EstabelecimentoService],
})
export class EstabelecimentoModule { }
