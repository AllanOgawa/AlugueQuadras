import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Nome completo do usuário.',
    example: 'João da Silva', required: false
  })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({
    description: 'Nickname único do usuário.',
    example: 'jao_silva', required: false
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Lista de imagens para adicionar.',
    example: ['usuario/imagem3.jpg'], required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagensToAdd?: string[];

  @ApiProperty({
    description: 'Lista de imagens para remover.',
    example: ['usuario/imagem1.jpg'],
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagensToRemove?: string[];
}
