import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { DiaSemana } from '@src/domains/gestao/estabelecimento/horario-funcionamento/enums/dia-semana.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHorarioFuncionamentoDto {
  @ApiProperty({
    description: 'Dia da semana para o funcionamento',
    example: DiaSemana.Segunda,
    enum: DiaSemana,
  })
  @IsEnum(DiaSemana)
  diaSemana: DiaSemana;

  @ApiProperty({
    description: 'Hora de abertura no formato HH:MM:SS',
    example: '08:00:00',
    pattern: '^([0-1]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'A hora de abertura deve estar no formato HH:MM:SS, entre 00:00:00 e 23:59:59',
  }) // Formato HH:MM:SS
  horaAbertura: string;

  @ApiProperty({
    description: 'Hora de fechamento no formato HH:MM:SS',
    example: '18:00:00',
    pattern: '^([0-1]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'A hora de abertura deve estar no formato HH:MM:SS, entre 00:00:00 e 23:59:59',
  }) // Formato HH:MM:SS
  horaFechamento: string;
}
