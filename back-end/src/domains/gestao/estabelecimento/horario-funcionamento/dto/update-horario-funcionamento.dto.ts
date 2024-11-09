import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { DiaSemana } from '@src/domains/gestao/estabelecimento/horario-funcionamento/enums/dia-semana.enum';

export class UpdateHorarioFuncionamentoDto {
  @IsOptional()
  @IsNumber()
  idkey?: number;

  @IsOptional()
  @IsEnum(DiaSemana)
  diaSemana?: DiaSemana;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/) // Formato HH:MM:SS
  horaAbertura?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/) // Formato HH:MM:SS
  horaFechamento?: string;
}
