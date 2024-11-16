import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { DiaSemana } from '@src/domains/gestao/estabelecimento/horario-funcionamento/enums/dia-semana.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateHorarioFuncionamentoDto {
  @ApiPropertyOptional({
    description: 'Identificador único do horário de funcionamento',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  idkey?: number;

  @ApiPropertyOptional({
    description: 'Dia da semana para o funcionamento',
    example: DiaSemana.Terca,
    enum: DiaSemana,
  })
  @IsOptional()
  @IsEnum(DiaSemana)
  diaSemana?: DiaSemana;

  @ApiPropertyOptional({
    description: 'Hora de abertura no formato HH:MM:SS',
    example: '09:00:00',
    pattern: '^([0-1]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/) // Formato HH:MM:SS
  horaAbertura?: string;

  @ApiPropertyOptional({
    description: 'Hora de fechamento no formato HH:MM:SS',
    example: '19:00:00',
    pattern: '^([0-1]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/) // Formato HH:MM:SS
  horaFechamento?: string;
}
