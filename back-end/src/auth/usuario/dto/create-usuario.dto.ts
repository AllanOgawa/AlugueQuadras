import { IsEmail, IsNotEmpty, IsString, IsNumber, IsOptional, MinLength, IsDate } from 'class-validator';
import { UsuarioTipo } from '../tipo/entities/tipo.entity';

export class CreateUsuarioDto {
  @IsString({ message: 'O campo username deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo username não pode estar vazio.' })
  @MinLength(6, {
    message: 'O username deve ter pelo menos 6 caracteres.',
  })
  username: string;

  @IsString({ message: 'O campo nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' })
  nome: string;

  @IsEmail({}, { message: 'O campo email deve ser um endereço de e-mail válido.' })
  @IsNotEmpty({ message: 'O campo email não pode estar vazio.' })
  email: string;

  @IsString({ message: 'O campo senha deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo senha não pode estar vazio.' })
  @MinLength(6, {
    message: 'A senha deve ter pelo menos 6 caracteres.',
  })
  senha: string;

  @IsString({ message: 'O campo cpf deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo cpf não pode estar vazio.' })
  cpf: string;

  @IsString({ message: 'O campo data_nascimento deve ser date.'})
  @IsNotEmpty({ message: 'O campo data_nascimento não pode estar vazio.'})
  data_nascimento: string;

  @IsOptional()
  data_cadastro?: Date;  // Opcional, será gerado automaticamente se não for fornecido

  @IsNumber()
  @IsNotEmpty({ message: 'O campo cpf não pode estar vazio.' })
  tipo: UsuarioTipo;
}
