import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTipoEsporteDto {
  @ApiPropertyOptional({
    description: 'Descricao do tipo de quadra',
    example: 'Futebol de Salão',
    type: String,
  })
  @IsString({ message: 'O campo descricao deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo descricao não pode estar vazio.' })
  descricao: string;
}
