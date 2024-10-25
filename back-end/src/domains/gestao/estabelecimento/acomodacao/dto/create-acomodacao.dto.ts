import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAcomodacaoDto {
  @ApiPropertyOptional({
    description: 'Descricao da acomodacao',
    example: 'Wifi',
    type: String,
  })
  @IsString({ message: 'O campo descricao deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo descricao não pode estar vazio.' })
  descricao: string;
}
