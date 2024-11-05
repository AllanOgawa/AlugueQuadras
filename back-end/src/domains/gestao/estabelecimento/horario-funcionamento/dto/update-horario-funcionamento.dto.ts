import { PartialType } from '@nestjs/swagger';
import { CreateHorarioFuncionamentoDto } from './create-horario-funcionamento.dto';

export class UpdateHorarioFuncionamentoDto extends PartialType(CreateHorarioFuncionamentoDto) {}
