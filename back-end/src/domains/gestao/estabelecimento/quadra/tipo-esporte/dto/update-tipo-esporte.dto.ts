import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTipoEsporteDto {
  @ApiPropertyOptional({
    description: 'Descrição atualizada do Tipo de Esporte.',
    example: 'Tênis',
  })
  @IsString()
  @IsOptional()
  descricao?: string;
}
