import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { DiaSemana } from '@src/domains/gestao/estabelecimento/horario-funcionamento/enums/dia-semana.enum';

export class CreateHorarioFuncionamentoDto {
  @IsEnum(DiaSemana)
  diaSemana: DiaSemana;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'A hora de abertura deve estar no formato HH:MM:SS, entre 00:00:00 e 23:59:59',
  }) // Formato HH:MM:SS
  horaAbertura: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'A hora de abertura deve estar no formato HH:MM:SS, entre 00:00:00 e 23:59:59',
  }) // Formato HH:MM:SS
  horaFechamento: string;
}
