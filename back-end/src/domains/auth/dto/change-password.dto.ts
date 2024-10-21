import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDTO {
  @ApiProperty({ description: 'Senha atual do usuário.', example: 'senhaAntiga123' })
  @IsString({ message: 'A senha atual deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha atual não pode estar vazia.' })
  senhaAtual: string;

  @ApiProperty({ description: 'Nova senha do usuário.', example: 'novaSenha123' })
  @IsString({ message: 'A nova senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A nova senha não pode estar vazia.' })
  @MinLength(6, { message: 'A nova senha deve ter pelo menos 6 caracteres.' })
  senhaNova: string;
}
