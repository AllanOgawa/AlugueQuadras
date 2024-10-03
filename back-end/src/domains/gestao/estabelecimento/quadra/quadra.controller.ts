import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuadraService } from './quadra.service';
import { CreateQuadraDto } from './dto/create-quadra.dto';
import { UpdateQuadraDto } from './dto/update-quadra.dto';

@Controller('quadra')
export class QuadraController {
  constructor(private readonly quadraService: QuadraService) {}

  @Post()
  create(@Body() createQuadraDto: CreateQuadraDto) {
    return this.quadraService.create(createQuadraDto);
  }

  @Get()
  findAll() {
    return this.quadraService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quadraService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuadraDto: UpdateQuadraDto) {
    return this.quadraService.update(+id, updateQuadraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quadraService.remove(+id);
  }
}
