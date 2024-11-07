import { forwardRef, Module } from '@nestjs/common';
import { HorarioFuncionamentoService } from './horario-funcionamento.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioFuncionamento } from './entities/horario-funcionamento.entity';
import { EstabelecimentoModule } from '../estabelecimento.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HorarioFuncionamento])
  ],
  providers: [HorarioFuncionamentoService],
  exports: [HorarioFuncionamentoService]
})
export class HorarioFuncionamentoModule { }
