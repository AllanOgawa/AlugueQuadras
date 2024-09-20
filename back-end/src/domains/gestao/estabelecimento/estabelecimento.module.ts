import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstabelecimentoService } from './estabelecimento.service';
import { EstabelecimentoController } from './estabelecimento.controller';
import { Estabelecimento } from './entities/estabelecimento.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Estabelecimento])], 
  controllers: [EstabelecimentoController],
  providers: [EstabelecimentoService],
})
export class EstabelecimentoModule {}
