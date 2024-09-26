import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class MudarSenhaDto {
  @IsString({ message: 'A senha atual deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha atual não pode estar vazia.' })
  senhaAtual: string;

  @IsString({ message: 'A nova senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A nova senha não pode estar vazia.' })
  @MinLength(6, { message: 'A nova senha deve ter pelo menos 6 caracteres.' })
  senhaNova: string;
}
