import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAcomodacaoDto {
  @ApiPropertyOptional({
    description: 'Nome da acomodação',
    example: 'Estacionamento para clientes',
  })
  acomodacao: string;
}
