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

  @Get(':idkey')
  findOne(@Param('idkey') idkey: string) {
    return this.estabelecimentoService.findOne(+idkey);
  }

  @Patch(':idkey')
  update(@Param('idkey') idkey: string, @Body() updateEstabelecimentoDto: Estabelecimento) {
    return this.estabelecimentoService.update(+idkey, updateEstabelecimentoDto);
  }

  @Delete(':idkey')
  remove(@Param('idkey') idkey: string) {
    return this.estabelecimentoService.remove(+idkey);
  }
}
