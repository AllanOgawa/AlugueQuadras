import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateQuadraDto {
  @ApiProperty({
    description: 'Nome da quadra',
    example: 'Quadra Central',
    type: String,
  })
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' })
  nome: string;

  @ApiPropertyOptional({
    description: 'Informações adicionais sobre a quadra',
    example: 'Quadra com piso de madeira e iluminação noturna.',
    type: String,
  })
  @IsString({ message: 'O campo informações adicionais deve ser uma string.' })
  @IsOptional()
  informacoesAdicionais?: string;

  @ApiProperty({
    description: 'Valor de aluguel da quadra',
    example: 150.00,
    type: Number,
  })
  @IsNumber({}, { message: 'O campo valor deve ser um número.' })
  @IsNotEmpty({ message: 'O campo valor não pode estar vazio.' })
  valor: number;

  @ApiProperty({
    description: 'Largura da quadra em metros',
    example: 5,
    type: Number,
  })
  @IsNumber({}, { message: 'O campo largura deve ser um número.' })
  @IsNotEmpty({ message: 'O campo largura não pode estar vazio.' })
  largura: number;

  @ApiProperty({
    description: 'Comprimento da quadra em metros',
    example: 10,
    type: Number,
  })
  @IsNumber({}, { message: 'O campo comprimento deve ser um número.' })
  @IsNotEmpty({ message: 'O campo comprimento não pode estar vazio.' })
  comprimento: number;

  @ApiProperty({
    description: 'ID do estabelecimento ao qual a quadra pertence',
    example: 5,
    type: Number,
  })
  @IsNumber({}, { message: 'O campo idkeyEstabelecimento deve ser um número.' })
  @IsNotEmpty({ message: 'O campo idkeyEstabelecimento não pode estar vazio.' })
  idkeyEstabelecimento: number; // ID do estabelecimento ao qual a quadra pertence

  @ApiProperty({
    description: 'Lista de imagens para adicionar.',
    example: ['estabelecimento/imagem1.jpg', 'estabelecimento/imagem2.png'],
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  imagensToAdd?: string[];

  @ApiProperty({
    description: 'Array com IDs dos tipos de esporte a serem adicionados à quadra',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray({ message: 'O campo tiposEsporteToAdd deve ser um array de IDs.' })
  @IsNotEmpty({ message: 'O campo tiposEsporteToAdd não pode estar vazio.' })
  tiposEsporteToAdd: number[];
}
