import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstabelecimentoService } from './estabelecimento.service';
import { CreateEstabelecimentoDto } from './dto/create-estabelecimento.dto';
import { UpdateEstabelecimentoDto } from './dto/update-estabelecimento.dto';
import { Estabelecimento } from './entities/estabelecimento.entity';


// Adicionar decorator do Swagger
@Controller('estabelecimento')
export class EstabelecimentoController {
  constructor(private readonly estabelecimentoService: EstabelecimentoService) {}

  @Post()
  create(@Body() createEstabelecimentoDto: CreateEstabelecimentoDto) {
    return this.estabelecimentoService.create(createEstabelecimentoDto);
  }

  @Get()
  findAll() {
    return this.estabelecimentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estabelecimentoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstabelecimentoDto: Estabelecimento) {
    return this.estabelecimentoService.update(+id, updateEstabelecimentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estabelecimentoService.remove(+id);
  }
}
