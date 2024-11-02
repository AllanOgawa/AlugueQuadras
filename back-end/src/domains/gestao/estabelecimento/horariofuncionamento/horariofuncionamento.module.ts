import { Module } from '@nestjs/common';
import { HorariofuncionamentoService } from './horariofuncionamento.service';
import { HorariofuncionamentoController } from './horariofuncionamento.controller';

@Module({
  controllers: [HorariofuncionamentoController],
  providers: [HorariofuncionamentoService],
})
export class HorariofuncionamentoModule {}
