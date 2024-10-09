import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, ValidationPipe, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { EstabelecimentoService } from './estabelecimento.service';
import { CreateEstabelecimentoDto } from './dto/create-estabelecimento.dto';
import { UpdateEstabelecimentoDto } from './dto/update-estabelecimento.dto';
import { Estabelecimento } from './entities/estabelecimento.entity';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/guard/jwt-auth.guard';


@ApiTags('Estabelecimento')
@UseGuards(JwtAuthGuard)
@Controller('estabelecimento')
export class EstabelecimentoController {
  constructor(private readonly estabelecimentoService: EstabelecimentoService) {}

  @Post()
  async create(@Body(ValidationPipe) createEstabelecimentoDto: CreateEstabelecimentoDto, @Request() req) {
    try {
      const usuario = req.user;
      return this.estabelecimentoService.create(createEstabelecimentoDto, usuario);
    } catch (error) {
      console.log(error);
      throw new HttpException('Erro ao buscar estabelecimentos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAllByUser(@Request() req) {
    try {
      const usuario = req.user;
      return await this.estabelecimentoService.findAllByUser(usuario);
      } catch (error) {
        throw new HttpException('Erro ao buscar todos estabelecimentos', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  @Get(':idkey')
  async findByIdkey(@Param('idkey') idkey: number): Promise<Estabelecimento> {
    try {
      const estabelecimento = await this.estabelecimentoService.findByIdkey(idkey);
      if (!estabelecimento) {
        throw new HttpException('Estabelecimento não encontrado', HttpStatus.NOT_FOUND);
      }
      return estabelecimento;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        console.error('Erro ao buscar estabelecimento:', error);
        throw new HttpException('Erro ao buscar estabelecimento', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


  @Patch(':idkey')
  async update(@Param('idkey') idkey: number, @Body(ValidationPipe) updateEstabelecimentoDto: UpdateEstabelecimentoDto): Promise<Estabelecimento> {
    try {
      await this.findByIdkey(idkey);
      return await this.estabelecimentoService.update(idkey, updateEstabelecimentoDto);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        throw new HttpException('Erro ao atualizar estabelecimento', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Delete(':idkey')
  async remove(@Param('idkey') idkey: number, @Request() req): Promise<void> {
    try {
      const usuario = req.user;
      await this.findByIdkey(idkey);
      await this.estabelecimentoService.remove(idkey, usuario);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
      throw new HttpException('Erro ao remover usuário', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
