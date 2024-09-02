import { IsString, MinLength } from 'class-validator';

export class UpdateUsuarioDto {
  @IsString()
  @MinLength(6, {
    message: 'A senha deve ter pelo menos 6 caracteres.',
  })
  senha: string;
}
