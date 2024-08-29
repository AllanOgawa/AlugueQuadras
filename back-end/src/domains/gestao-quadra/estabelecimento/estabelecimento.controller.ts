import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstabelecimentoService } from './estabelecimento.service';
import { CreateEstabelecimentoDto } from './dto/create-estabelecimento.dto';
import { UpdateEstabelecimentoDto } from './dto/update-estabelecimento.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Estabelecimento')
@Controller('estabelecimento')
export class EstabelecimentoController {
  constructor(private readonly estabelecimentoService: EstabelecimentoService) {}

  @ApiOperation({summary: 'Enviar estabelecimento'})
  @Post()
  create(@Body() createEstabelecimentoDto: CreateEstabelecimentoDto) {
    return this.estabelecimentoService.create(createEstabelecimentoDto);
  }

  @ApiOperation({summary: 'Obter todos os estabelecimentos'})
  @Get()
  findAll() {
    return this.estabelecimentoService.findAll();
  }

  @ApiOperation({summary: 'Obter um estabelecimento específico'})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estabelecimentoService.findOne(+id);
  }

  @ApiOperation({summary: 'Atualizar um estabelecimento'})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstabelecimentoDto: UpdateEstabelecimentoDto) {
    return this.estabelecimentoService.update(+id, updateEstabelecimentoDto);
  }

  @ApiOperation({summary: 'Deletar estabelecimento'})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estabelecimentoService.remove(+id);
  }
}
