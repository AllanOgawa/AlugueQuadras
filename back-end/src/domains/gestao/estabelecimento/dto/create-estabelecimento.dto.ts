import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

export class CreateEstabelecimentoDto {
  @IsString({ message: 'O campo CNPJ deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo CNPJ não pode estar vazio.' })
  @Length(14, 14)
  cnpj: string;

  @IsString({ message: 'O campo CNPJ deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo CNPJ não pode estar vazio.' })
  razaoSocial: string;

  @IsString({ message: 'O campo telefone deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo telefone não pode estar vazio.' })
  telefone: string;

  @IsEmail()
  @IsNotEmpty({ message: 'O campo email não pode estar vazio.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'O campo alvara não pode estar vazio.' })
  alvara: string;
}
