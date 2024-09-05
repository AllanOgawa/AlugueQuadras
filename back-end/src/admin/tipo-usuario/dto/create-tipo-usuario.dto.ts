import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTipoUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'O campo descricao não pode estar vazio.' })
  descricao: string;
}
