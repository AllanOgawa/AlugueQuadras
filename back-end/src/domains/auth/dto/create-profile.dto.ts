import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, MinLength, IsArray } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ 
    description: 'Username do usuário.', 
    example: 'usuario123' 
  })
  @IsString({ message: 'O campo username deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo username não pode estar vazio.' })
  @MinLength(6, { message: 'O username deve ter pelo menos 6 caracteres.' })
  username: string;

  @ApiProperty({ 
    description: 'Nome completo do usuário.', 
    example: 'Eduardo Richard' 
  })
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' })
  nome: string;

  @ApiProperty({ 
    description: 'Email do usuário.', 
    example: 'richard@example.com' 
  })
  @IsEmail({}, { message: 'O campo email deve ser um endereço de e-mail válido.' })
  @IsNotEmpty({ message: 'O campo email não pode estar vazio.' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário.',
    example: 'senhaSegura123' 
  })
  @IsString({ message: 'O campo senha deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo senha não pode estar vazio.' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
  senha: string;

  @ApiProperty({ 
    description: 'CPF do usuário.', 
    example: '123.456.789-00' 
  })
  @IsString({ message: 'O campo cpf deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo cpf não pode estar vazio.' })
  cpf: string;

  @ApiProperty({ 
    description: 'Data de nascimento do usuário.', 
    example: '1990-01-01' 
  })
  @IsString({ message: 'O campo dataNascimento deve ser uma data.' })
  @IsNotEmpty({ message: 'O campo dataNascimento não pode estar vazio.' })
  dataNascimento: string;

  @ApiProperty({ 
    description: 'Lista de imagens para adicionar.', 
    example: ['usuario/imagem1.jpg', 'usuario/imagem2.png'], 
    required: false 
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagensToAdd?: string[];
}
