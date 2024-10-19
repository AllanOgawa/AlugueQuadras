import { IsString, IsEmail, IsOptional, IsArray }  from 'class-validator';
import { ApiPropertyOptional }            from '@nestjs/swagger';

export class UpdateEstabelecimentoDto {
  @ApiPropertyOptional({
    description: 'Nome do Estabelecimento',
    example: 'Tenis Club',
    type: String
  })
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @IsOptional()
  nome?: string;

  @ApiPropertyOptional({
    description: 'Telefone do estabelecimento',
    example: '(11) 98765-4321',
    type: String
  })
  @IsString({ message: 'O campo telefone deve ser uma string.' })
  @IsOptional()
  telefone?: string;

  @ApiPropertyOptional({
    description: 'Email de contato do estabelecimento',
    example: 'contato@empresaexemplo.com.br',
    type: String
  })
  @IsEmail({}, { message: 'O campo email deve ser um endereço de email válido.' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Alvará de funcionamento do estabelecimento',
    example: 'ALVARA-123456',
    type: String
  })
  @IsString({ message: 'O campo alvará deve ser uma string.' })
  @IsOptional()
  alvara?: string;
  
  @ApiPropertyOptional({ 
    description: 'Lista de imagens para adicionar.', 
    example: ['estabelecimento/imagem3.jpg'], required: false 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagensToAdd?: string[];

  @ApiPropertyOptional({ 
    description: 'Lista de imagens para remover.', 
    example: ['estabelecimento/imagem1.jpg'], 
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagensToRemove?: string[];
}
