import { IsEmail, IsNotEmpty, IsString, IsNumber, IsOptional, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty({ message: 'O campo idkey_tipo_usuario não pode estar vazio.' })
  @IsNumber({}, { message: 'O campo idkey_tipo_usuario deve ser um número.' })
  idkey_tipo_usuario: number;

  @IsEmail({}, { message: 'O campo email deve ser um endereço de e-mail válido.' })
  @IsNotEmpty({ message: 'O campo email não pode estar vazio.' })
  email: string;

  @IsString({ message: 'O campo senha deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo senha não pode estar vazio.' })
  @MinLength(6, {
    message: 'A senha deve ter pelo menos 6 caracteres.',
  })
  senha: string;

  @IsOptional()
  data_cadastro?: Date;  // Opcional, será gerado automaticamente se não for fornecido
}
