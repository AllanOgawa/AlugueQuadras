import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

export class CreateEstabelecimentoDto {
  @IsString()
  @IsNotEmpty()
  @Length(14, 14)
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  razaoSocial: string;

  @IsString()
  @IsNotEmpty()
  telefone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  alvara?: string;
}
