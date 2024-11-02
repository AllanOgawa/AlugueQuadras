// src/domains/geral/endereco/dto/update-endereco.dto.ts

import { 
  IsString, 
  Length, 
  IsOptional, 
  IsNotEmpty
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEnderecoDto {
  @ApiPropertyOptional({
    description: 'Logradouro do endereço',
    example: 'Rua das Flores',
    type: String
  })
  @IsString({ message: 'O campo logradouro deve ser uma string.' })
  @IsOptional()
  logradouro?: string;

  @ApiPropertyOptional({
    description: 'Número do endereço',
    example: '123',
    type: String
  })
  @IsString({ message: 'O campo número deve ser uma string.' })
  @IsOptional()
  numero?: string;

  @ApiPropertyOptional({
    description: 'Complemento do endereço',
    example: 'Esquina com a Rua das Rosas',
    type: String
  })
  @IsString({ message: 'O campo complemento deve ser uma string.' })
  @IsOptional()
  complemento?: string;

  @ApiPropertyOptional({
    description: 'Bairro do endereço',
    example: 'Centro',
    type: String
  })
  @IsString({ message: 'O campo bairro deve ser uma string.' })
  @IsOptional()
  bairro?: string;

  @ApiPropertyOptional({
    description: 'Cidade do endereço',
    example: 'São Paulo',
    type: String
  })
  @IsString({ message: 'O campo cidade deve ser uma string.' })
  @IsOptional()
  cidade?: string;

  @ApiPropertyOptional({
    description: 'Estado do endereço',
    example: 'SP',
    type: String,
    minLength: 2,
    maxLength: 2
  })
  @IsString({ message: 'O campo estado deve ser uma string.' })
  @IsOptional()
  @Length(2, 2, { message: 'O campo estado deve ter exatamente 2 caracteres.' })
  estado?: string;

  @ApiPropertyOptional({
    description: 'CEP do endereço',
    example: '12345678',
    type: String,
    minLength: 8,
    maxLength: 8
  })
  @IsString({ message: 'O campo CEP deve ser uma string.' })
  @IsOptional()
  @Length(8, 8, { message: 'O campo CEP deve ter exatamente 8 caracteres.' })
  cep?: string;
}
