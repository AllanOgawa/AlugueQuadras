import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDate, IsNumber, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEndAfterStart } from '../validators/is-end-after-start.validator';

export class CreateReservaDto {
  @ApiProperty({
    description: 'Data e hora de início da reserva no formato ISO 8601',
    example: '2024-10-01T10:00:00.000Z',
    type: String,
  })
  @IsNotEmpty({ message: 'O campo dataInicio não pode estar vazio.' })
  @IsDate({ message: 'O campo dataInicio deve ser uma data válida.' })
  @Type(() => Date)
  dataInicio: Date;

  @ApiProperty({
    description: 'Data e hora de término da reserva no formato ISO 8601',
    example: '2024-10-01T12:00:00.000Z',
    type: String,
  })
  @IsNotEmpty({ message: 'O campo dataFim não pode estar vazio.' })
  @IsDate({ message: 'O campo dataFim deve ser uma data válida.' })
  @Type(() => Date)
  @Validate(IsEndAfterStart)
  dataFim: Date;

  @ApiProperty({
    description: 'Identificador da quadra que está sendo reservada',
    example: 2,
    type: Number,
  })
  @IsNotEmpty({ message: 'O campo idkeyQuadra não pode estar vazio.' })
  @IsNumber({}, { message: 'O campo idkeyQuadra deve ser um número.' })
  idkeyQuadra: number;
}
