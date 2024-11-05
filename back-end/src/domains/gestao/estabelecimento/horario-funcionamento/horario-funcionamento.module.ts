import { Module } from '@nestjs/common';
import { HorarioFuncionamentoService } from './horario-funcionamento.service';
import { HorarioFuncionamentoController } from './horario-funcionamento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HorarioFuncionamento } from './entities/horario-funcionamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioFuncionamento])],
  controllers: [HorarioFuncionamentoController],
  providers: [HorarioFuncionamentoService],
})
export class HorarioFuncionamentoModule { }
