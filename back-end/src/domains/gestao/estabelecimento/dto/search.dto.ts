import { IsOptional, IsString, IsNumber, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchEstabelecimentoDto {
  @ApiPropertyOptional({ description: 'ID único do estabelecimento' })
  @IsOptional()
  @IsInt({ message: 'idkey deve ser um número inteiro' })
  @Type(() => Number) // Transforma o valor para Number
  idkey?: number;

  @ApiPropertyOptional({ description: 'Nome do estabelecimento' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ description: 'Rating do estabelecimento' })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional({ description: 'Número da página', default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: 'Número de itens por página', default: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number;
}
