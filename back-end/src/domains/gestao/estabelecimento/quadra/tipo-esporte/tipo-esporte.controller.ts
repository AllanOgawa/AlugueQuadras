import { Controller, Get, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags }      from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/domains/auth/guard/jwt-auth.guard';

import { TipoEsporteService } from './tipo-esporte.service';
import { TipoEsporte }        from './entities/tipo-esporte.entity';

@ApiTags('TipoEsporte')
@UseGuards(JwtAuthGuard)
@Controller('estabelecimento/quadra/tipo-esporte')
export class TipoEsporteController {
  constructor(private readonly tipoEsporteService: TipoEsporteService) {}

  @Get('list')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Buscar todos Tipos Esportes' })
  @ApiResponse({ status: 200, description: 'Tipos Esportes encontrado', type: TipoEsporte, isArray: true })
  @ApiResponse({ status: 500, description: 'Erro ao buscar Tipo Esporte' })
  async findAll(): Promise<TipoEsporte[]> {
    try {
      return await this.tipoEsporteService.findAll();
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
