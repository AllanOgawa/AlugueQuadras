import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Reserva } from './entities/reserva.entity';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { IsEndAfterStart } from './validators/is-end-after-start.validator';
import { QuadraModule } from '../quadra.module';
import { HorarioFuncionamentoModule } from '../../horario-funcionamento/horario-funcionamento.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reserva]),
    forwardRef(() => QuadraModule),
    HorarioFuncionamentoModule,
  ],
  controllers: [ReservaController],
  providers: [ReservaService, IsEndAfterStart],
})
export class ReservaModule { }
