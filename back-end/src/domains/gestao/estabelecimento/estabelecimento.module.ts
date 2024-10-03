import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa o TypeOrmModule
import { EstabelecimentoService } from './estabelecimento.service';
import { EstabelecimentoController } from './estabelecimento.controller';
import { Estabelecimento } from './entities/estabelecimento.entity'; // Importa a entidade
import { QuadraModule } from './quadra/quadra.module';

@Module({
  imports: [TypeOrmModule.forFeature([Estabelecimento]), 
    QuadraModule], 
  controllers: [EstabelecimentoController],
  providers: [EstabelecimentoService],
})
export class EstabelecimentoModule {}
