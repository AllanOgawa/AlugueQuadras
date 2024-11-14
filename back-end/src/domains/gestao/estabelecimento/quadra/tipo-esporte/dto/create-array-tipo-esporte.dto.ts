import { Type } from 'class-transformer';
import { ArrayMinSize, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateTipoEsporteDto } from './create-tipo-esporte.dto';

export class CreateTipoEsporteArrayDto {
  @ApiProperty({
    description: 'Array de Tipos de Esporte a serem criados.',
    type: [CreateTipoEsporteDto],
    example: [
      { descricao: 'Futebol' },
      { descricao: 'Basquete' },
      { descricao: 'Vôlei' },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateTipoEsporteDto)
  @ArrayMinSize(1, { message: 'Deve fornecer pelo menos um Tipo de Esporte.' })
  tiposEsporte: CreateTipoEsporteDto[];
}
