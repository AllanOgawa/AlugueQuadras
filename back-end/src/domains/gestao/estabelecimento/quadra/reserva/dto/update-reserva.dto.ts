import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDate, IsNumber, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEndAfterStart } from '../validators/is-end-after-start.validator';

export class UpdateReservaDto {
  @ApiPropertyOptional({
    description: 'Data e hora de início da reserva no formato ISO 8601',
    example: '2024-10-01T10:00:00.000Z',
    type: String,
  })
  @IsOptional()
  @IsDate({ message: 'O campo dataInicio deve ser uma data válida.' })
  @Type(() => Date)
  dataInicio?: Date;

  @ApiPropertyOptional({
    description: 'Data e hora de término da reserva no formato ISO 8601',
    example: '2024-10-01T12:00:00.000Z',
    type: String,
  })
  @IsOptional()
  @IsDate({ message: 'O campo dataFim deve ser uma data válida.' })
  @Type(() => Date)
  @Validate(IsEndAfterStart)
  dataFim?: Date;

  @ApiPropertyOptional({
    description: 'Identificador do usuário que está fazendo a reserva',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'O campo idUsuario deve ser um número.' })
  idUsuario?: number;

  @ApiPropertyOptional({
    description: 'Identificador da quadra que está sendo reservada',
    example: 2,
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'O campo idQuadra deve ser um número.' })
  idQuadra?: number;
}
