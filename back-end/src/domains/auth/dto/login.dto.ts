import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    description: 'Username ou Email do usuário.', 
    example: 'usuario123 / usuario123@exemplo.com' 
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ 
    description: 'Senha do usuário.', 
    example: 'senhaSegura123'
  })
  @IsString()
  @IsNotEmpty()
  senha: string;
}