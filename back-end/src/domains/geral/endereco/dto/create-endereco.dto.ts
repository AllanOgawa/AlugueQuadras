// src/domains/geral/endereco/dto/create-endereco.dto.ts

import { 
  IsNotEmpty, 
  IsString, 
  Length, 
  IsOptional 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEnderecoDto {

  @ApiProperty({
    description: 'Logradouro do endereço',
    example: 'Rua das Flores',
    type: String
  })
  @IsString({ message: 'O campo logradouro deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo logradouro não pode estar vazio.' })
  logradouro: string;

  @ApiProperty({
    description: 'Número do endereço',
    example: '123',
    type: String
  })
  @IsString({ message: 'O campo número deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo número não pode estar vazio.' })
  numero: string;

  @ApiPropertyOptional({
    description: 'Complemento do endereço',
    example: 'Esquina com a Rua das Rosas',
    type: String
  })
  @IsString({ message: 'O campo complemento deve ser uma string.' })
  @IsOptional()
  complemento?: string;

  @ApiProperty({
    description: 'Bairro do endereço',
    example: 'Centro',
    type: String
  })
  @IsString({ message: 'O campo bairro deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo bairro não pode estar vazio.' })
  bairro: string;

  @ApiProperty({
    description: 'Cidade do endereço',
    example: 'São Paulo',
    type: String
  })
  @IsString({ message: 'O campo cidade deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo cidade não pode estar vazio.' })
  cidade: string;

  @ApiProperty({
    description: 'Estado do endereço',
    example: 'SP',
    type: String,
    minLength: 2,
    maxLength: 2
  })
  @IsString({ message: 'O campo estado deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo estado não pode estar vazio.' })
  @Length(2, 2, { message: 'O campo estado deve ter exatamente 2 caracteres.' })
  estado: string;

  @ApiProperty({
    description: 'CEP do endereço',
    example: '12345678',
    type: String,
    minLength: 8,
    maxLength: 8
  })
  @IsString({ message: 'O campo CEP deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo CEP não pode estar vazio.' })
  @Length(8, 8, { message: 'O campo CEP deve ter exatamente 8 caracteres.' })
  cep: string;

  @ApiProperty({
    description: 'Latitude do endereço',
    example: '-23.550520',
    type: String,
  })
  @IsString({ message: 'O campo latitude deve ser uma string.' })
  latitude: string;
  
  @ApiProperty({
    description: 'Longitude do endereço',
    example: '-46.633308',
    type: String,
  })
  @IsString({ message: 'O campo longitude deve ser uma string.' })
  longitude: string;
  
}
