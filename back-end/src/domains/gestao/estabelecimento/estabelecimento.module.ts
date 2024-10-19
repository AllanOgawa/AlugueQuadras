import { Module }         from '@nestjs/common';
import { TypeOrmModule }  from '@nestjs/typeorm';

import { Estabelecimento }            from './entities/estabelecimento.entity';
import { EstabelecimentoService }     from './estabelecimento.service';
import { EstabelecimentoController }  from './estabelecimento.controller';

import { QuadraModule }   from './quadra/quadra.module';
import { UsuarioModule }  from '@src/domains/auth/usuario/usuario.module';
import { ImagemModule }   from '@src/domains/storage/imagem/imagem.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Estabelecimento]), 
    QuadraModule,
    UsuarioModule,
    ImagemModule
  ], 
  controllers: [EstabelecimentoController],
  providers: [EstabelecimentoService],
  exports: [EstabelecimentoService],
})
export class EstabelecimentoModule {}
