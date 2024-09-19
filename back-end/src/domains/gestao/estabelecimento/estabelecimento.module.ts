import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa o TypeOrmModule
import { EstabelecimentoService } from './estabelecimento.service';
import { EstabelecimentoController } from './estabelecimento.controller';
import { Estabelecimento } from './entities/estabelecimento.entity'; // Importa a entidade

@Module({
  imports: [TypeOrmModule.forFeature([Estabelecimento])], // Registra a entidade Estabelecimento
  controllers: [EstabelecimentoController],
  providers: [EstabelecimentoService],
})
export class EstabelecimentoModule {}
