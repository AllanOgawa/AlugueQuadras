import { Module } from '@nestjs/common';
import { AcomodacaoService } from './acomodacao.service';
import { AcomodacaoController } from './acomodacao.controller';

@Module({
  controllers: [AcomodacaoController],
  providers: [AcomodacaoService],
})
export class AcomodacaoModule {}
