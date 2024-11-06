import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAcomodacaoDto {
    @ApiPropertyOptional({
        description: 'Nome da acomodação',
        example: 'Estacionamento para clientes',
    })
    descricao: string;

    @ApiPropertyOptional({
        description: 'Ícone da acomodação',
        example: 'icone_estacionamento.png',
    })
    icone?: string;
}
