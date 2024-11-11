import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HorarioFuncionamentoService } from './horario-funcionamento.service';
import { HorarioFuncionamento } from './entities/horario-funcionamento.entity';

@ApiTags('Horário de Funcionamento')
@Controller('estabelecimento/:idkeyEstabelecimento/horario-funcionamento')
export class HorarioFuncionamentoController {
  constructor(
    private readonly horarioFuncionamentoService: HorarioFuncionamentoService,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Obter todos os horários de funcionamento de um estabelecimento' })
  @ApiParam({
    name: 'idkeyEstabelecimento',
    type: Number,
    description: 'ID único do estabelecimento',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de horários de funcionamento do estabelecimento',
    type: [HorarioFuncionamento],
  })
  @ApiResponse({
    status: 404,
    description: 'Estabelecimento não encontrado',
  })
  async findAllByEstabelecimento(
    @Param('idkeyEstabelecimento') idkeyEstabelecimento: number,
  ): Promise<HorarioFuncionamento[]> {
    return this.horarioFuncionamentoService.findAllByEstabelecimento(idkeyEstabelecimento);
  }
}
