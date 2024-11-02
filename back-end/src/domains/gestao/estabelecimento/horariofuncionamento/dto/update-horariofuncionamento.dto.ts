import { PartialType } from '@nestjs/swagger';
import { CreateHorariofuncionamentoDto } from './create-horariofuncionamento.dto';

export class UpdateHorariofuncionamentoDto extends PartialType(CreateHorariofuncionamentoDto) {}
