import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TipoEsporte } from './entities/tipo-esporte.entity';
import { Quadra } from './entities/quadra.entity';
import { QuadraService } from './quadra.service';
import { QuadraController } from './quadra.controller';

import { EstabelecimentoModule } from '../estabelecimento.module';

@Module({
  imports: [TypeOrmModule.forFeature([Quadra, TipoEsporte]),
    forwardRef(() => EstabelecimentoModule)],
  controllers: [QuadraController],
  providers: [QuadraService],
  exports: [QuadraService],
})
export class QuadraModule {}
