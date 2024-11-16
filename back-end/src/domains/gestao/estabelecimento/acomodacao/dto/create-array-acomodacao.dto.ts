// src/acomodacao/dto/create-acomodacao-array.dto.ts
import { Type } from 'class-transformer';
import { ArrayMinSize, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAcomodacaoDto } from './create-acomodacao.dto';

export class CreateAcomodacaoArrayDto {
  @ApiProperty({
    description: 'Array de Acomodações a serem criadas.',
    type: [CreateAcomodacaoDto],
    example: [
      {
        descricao: 'CADEIRANTE',
        icone: 'icone_cadeirante.png',
      },
      {
        descricao: 'WIFI',
        icone: 'icone_wifi.png',
      },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateAcomodacaoDto)
  @ArrayMinSize(1, { message: 'Deve fornecer pelo menos uma Acomodação.' })
  acomodacoes: CreateAcomodacaoDto[];
}
