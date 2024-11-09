import { forwardRef, Module } from '@nestjs/common';
import { HorarioFuncionamentoService } from './horario-funcionamento.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioFuncionamento } from './entities/horario-funcionamento.entity';
import { HorarioFuncionamentoController } from './horario-funcionamento.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([HorarioFuncionamento])
  ],
  controllers: [HorarioFuncionamentoController],
  providers: [HorarioFuncionamentoService],
  exports: [HorarioFuncionamentoService]
})
export class HorarioFuncionamentoModule { }
