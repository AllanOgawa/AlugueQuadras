import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule }      from '@nestjs/typeorm';

import { Quadra }             from './entities/quadra.entity';
import { QuadraService }      from './quadra.service';
import { QuadraController }   from './quadra.controller';

import { EstabelecimentoModule }  from '../estabelecimento.module';
import { TipoEsporteModule }      from './tipo-esporte/tipo-esporte.module';

@Module({
  imports: 
  [
    TypeOrmModule.forFeature([Quadra]),
    TipoEsporteModule,
    forwardRef(() => EstabelecimentoModule),
  ],
  controllers: [QuadraController],
  providers: [QuadraService],
  exports: [QuadraService],
})
export class QuadraModule {}
