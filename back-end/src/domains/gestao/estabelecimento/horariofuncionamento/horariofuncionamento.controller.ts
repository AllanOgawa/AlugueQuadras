import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HorariofuncionamentoService } from './horariofuncionamento.service';
import { CreateHorariofuncionamentoDto } from './dto/create-horariofuncionamento.dto';
import { UpdateHorariofuncionamentoDto } from './dto/update-horariofuncionamento.dto';

@Controller('horariofuncionamento')
export class HorariofuncionamentoController {
  constructor(private readonly horariofuncionamentoService: HorariofuncionamentoService) {}

  @Post()
  create(@Body() createHorariofuncionamentoDto: CreateHorariofuncionamentoDto) {
    return this.horariofuncionamentoService.create(createHorariofuncionamentoDto);
  }

  @Get()
  findAll() {
    return this.horariofuncionamentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.horariofuncionamentoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHorariofuncionamentoDto: UpdateHorariofuncionamentoDto) {
    return this.horariofuncionamentoService.update(+id, updateHorariofuncionamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.horariofuncionamentoService.remove(+id);
  }
}
