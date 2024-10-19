import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AcomodacaoService } from './acomodacao.service';
import { CreateAcomodacaoDto } from './dto/create-acomodacao.dto';
import { UpdateAcomodacaoDto } from './dto/update-acomodacao.dto';

@Controller('acomodacao')
export class AcomodacaoController {
  constructor(private readonly acomodacaoService: AcomodacaoService) {}

  @Post()
  create(@Body() createAcomodacaoDto: CreateAcomodacaoDto) {
    return this.acomodacaoService.create(createAcomodacaoDto);
  }

  @Get()
  findAll() {
    return this.acomodacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.acomodacaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAcomodacaoDto: UpdateAcomodacaoDto) {
    return this.acomodacaoService.update(+id, updateAcomodacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.acomodacaoService.remove(+id);
  }
}
