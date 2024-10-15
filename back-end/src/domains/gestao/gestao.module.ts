import { Module } from '@nestjs/common';

import { EstabelecimentoModule }  from './estabelecimento/estabelecimento.module';
import { QuadraModule }           from './estabelecimento/quadra/quadra.module';

@Module({
  imports: [
    EstabelecimentoModule,
    QuadraModule,
  ]
})
export class GestaoModule { }