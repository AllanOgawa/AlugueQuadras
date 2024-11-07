import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { DiaSemana } from '@src/domains/gestao/estabelecimento/horario-funcionamento/enums/dia-semana.enum';

export class CreateHorarioFuncionamentoDto {
  @IsEnum(DiaSemana)
  diaSemana: DiaSemana;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/) // Formato HH:MM:SS
  horaAbertura: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/) // Formato HH:MM:SS
  horaFechamento: string;
}
