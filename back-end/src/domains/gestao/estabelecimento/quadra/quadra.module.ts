import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule }      from '@nestjs/typeorm';

import { Quadra }             from './entities/quadra.entity';
import { QuadraService }      from './quadra.service';
import { QuadraController }   from './quadra.controller';

import { EstabelecimentoModule }  from '../estabelecimento.module';
import { TipoEsporteModule }      from './tipo-esporte/tipo-esporte.module';
import { ImagemModule } from '@src/domains/storage/imagem/imagem.module';
import { ReservaModule } from './reserva/reserva.module';

@Module({
  imports: 
  [
    TypeOrmModule.forFeature([Quadra]),
    TipoEsporteModule,
    ImagemModule,
    forwardRef(() => EstabelecimentoModule),
    ReservaModule,
  ],
  controllers: [QuadraController],
  providers: [QuadraService],
  exports: [QuadraService],
})
export class QuadraModule {}
