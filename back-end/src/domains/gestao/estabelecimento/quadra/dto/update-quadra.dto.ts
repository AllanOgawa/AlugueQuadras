import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray, ArrayUnique } from 'class-validator';

export class UpdateQuadraDto {
  @ApiPropertyOptional({
    description: 'Nome da quadra',
    example: 'Quadra Nova',
    type: String,
  })
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @IsOptional()
  nome?: string;

  @ApiPropertyOptional({
    description: 'Informações adicionais sobre a quadra',
    example: 'Quadra com novas redes e iluminação',
    type: String,
  })
  @IsString({ message: 'O campo informações adicionais deve ser uma string.' })
  @IsOptional()
  informacoesAdicionais?: string;

  @ApiPropertyOptional({
    description: 'Valor de aluguel da quadra',
    example: 200.00,
    type: Number,
  })
  @IsNumber({}, { message: 'O campo valor deve ser um número.' })
  @IsOptional()
  valor?: number;

  @ApiPropertyOptional({
    description: 'Largura da quadra em metros',
    example: 5,
    type: Number,
  })
  @IsNumber({}, { message: 'O campo largura deve ser um número.' })
  @IsOptional()
  largura?: number;

  @ApiPropertyOptional({
    description: 'Comprimento da quadra em metros',
    example: 10,
    type: Number,
  })
  @IsNumber({}, { message: 'O campo comprimento deve ser um número.' })
  @IsOptional()
  comprimento?: number;

  @ApiPropertyOptional({
    description: 'Imagem (path do bucket) associada à quadra',
    example: 'path/to/new-quadra-imagem.jpg',
    type: String,
  })
  @IsString({ message: 'O campo imagem deve ser uma string.' })
  @IsOptional()
  imagem?: string;

  @ApiPropertyOptional({
    description: 'Array com IDs dos tipos de esporte a adicionar à quadra',
    example: [1, 2],
    type: [Number],
  })
  @IsOptional()
  @IsArray({ message: 'O campo tipoEsporteToAdd deve ser um array de IDs.' })
  @ArrayUnique({ message: 'O campo tipoEsporteToAdd deve conter apenas valores únicos.' })
  tipoEsporteToAdd?: number[];

  @ApiPropertyOptional({
    description: 'Array com IDs dos tipos de esporte a remover da quadra',
    example: [3, 4],
    type: [Number],
  })
  @IsOptional()
  @IsArray({ message: 'O campo tipoEsporteToRemove deve ser um array de IDs.' })
  @ArrayUnique({ message: 'O campo tipoEsporteToRemove deve conter apenas valores únicos.' })
  tipoEsporteToRemove?: number[];
}
