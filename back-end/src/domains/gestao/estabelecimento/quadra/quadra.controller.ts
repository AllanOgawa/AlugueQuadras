import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, ValidationPipe, HttpStatus, UseGuards } from '@nestjs/common';
import { QuadraService } from './quadra.service';
import { CreateQuadraDto } from './dto/create-quadra.dto';
import { UpdateQuadraDto } from './dto/update-quadra.dto';
import { Quadra } from './entities/quadra.entity';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/guard/jwt-auth.guard';

@ApiTags('Quadra')
@UseGuards(JwtAuthGuard)
@Controller('quadra')
export class QuadraController {
  constructor(private readonly quadraService: QuadraService) {}

  @Post()
  async create(@Body(ValidationPipe) createQuadraDto: CreateQuadraDto) {
    try {
      return await this.quadraService.create(createQuadraDto);
    } catch (error) {
      throw new HttpException(
        'Erro ao criar quadra',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.quadraService.findAll();
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar todas as quadras',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':idkey')
  async findByIdkey(@Param('idkey') idkey: number): Promise<Quadra> {
    try {
      const quadra = await this.quadraService.findByIdkey(idkey);
      if (!quadra) {
        throw new HttpException('Quadra não encontrada', HttpStatus.NOT_FOUND);
      }
      return quadra;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        console.error('Erro ao buscar quadra:', error);
        throw new HttpException(
          'Erro ao buscar quadra',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Patch(':idkey')
  async update(
    @Param('idkey') idkey: number,
    @Body(ValidationPipe) updateQuadraDto: UpdateQuadraDto,
  ): Promise<Quadra> {
    try {
      await this.findByIdkey(idkey);
      return await this.quadraService.update(idkey, updateQuadraDto);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        throw new HttpException(
          'Erro ao atualizar quadra',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Delete(':idkey')
  async remove(@Param('idkey') idkey: number): Promise<void> {
    try {
      await this.findByIdkey(idkey);
      await this.quadraService.remove(idkey);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        throw new HttpException(
          'Erro ao remover quadra',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
