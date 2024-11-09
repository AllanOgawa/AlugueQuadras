import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateAcomodacaoDto {
    @ApiPropertyOptional({
        description: 'Nome da acomodação',
        exemple: 'Estacionamento para clientes',
    })
    acomodacao: string;

}