import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, ValidationPipe, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Estabelecimento } from './entities/estabelecimento.entity';
import { EstabelecimentoService } from './estabelecimento.service';
import { CreateEstabelecimentoDto } from './dto/create-estabelecimento.dto';
import { UpdateEstabelecimentoDto } from './dto/update-estabelecimento.dto';

import { JwtAuthGuard } from '@src/domains/auth/guard/jwt-auth.guard';

@ApiTags('Estabelecimento')
@Controller('estabelecimento')
export class EstabelecimentoController {
  constructor(private readonly estabelecimentoService: EstabelecimentoService) {}

  @Post('new')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Criar um novo estabelecimento' })
  @ApiResponse({ status: 201, description: 'Estabelecimento criado com sucesso', type: Estabelecimento })
  @ApiResponse({ status: 500, description: 'Erro ao criar o estabelecimento' })
  async create(@Body(ValidationPipe) createEstabelecimentoDto: CreateEstabelecimentoDto, @Request() req) {
    try {
      const usuario = req.user;
      return this.estabelecimentoService.create(createEstabelecimentoDto, usuario);
    } catch (error) {
      console.log(error);
      throw new HttpException('Erro ao buscar estabelecimentos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('search/:idkey')
  @ApiOperation({ summary: 'Buscar estabelecimento por ID' })
  @ApiParam({ name: 'idkey', description: 'ID do estabelecimento a ser buscado', example: 1 })
  @ApiResponse({ status: 200, description: 'Estabelecimento encontrado com sucesso', type: Estabelecimento })
  @ApiResponse({ status: 404, description: 'Estabelecimento não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro ao buscar o estabelecimento' })
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

  @Get('usuario')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Listar todos os estabelecimentos do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de estabelecimentos retornada com sucesso', type: [Estabelecimento] })
  @ApiResponse({ status: 500, description: 'Erro ao buscar todos os estabelecimentos' })
  async findAllByUser(@Request() req) {
    try {
      const usuario = req.user;
      return await this.estabelecimentoService.findAllByUser(usuario);
      } catch (error) {
        throw new HttpException('Erro ao buscar todos estabelecimentos', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  @Patch('edit/:idkey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Atualizar um estabelecimento existente por ID' })
  @ApiParam({ name: 'idkey', description: 'ID do estabelecimento a ser atualizado', example: 1 })
  @ApiResponse({ status: 200, description: 'Estabelecimento atualizado com sucesso', type: Estabelecimento })
  @ApiResponse({ status: 404, description: 'Estabelecimento não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro ao atualizar o estabelecimento' })
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

  @Delete('remove/:idkey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Remover um estabelecimento por ID' })
  @ApiParam({ name: 'idkey', description: 'ID do estabelecimento a ser removido', example: 1 })
  @ApiResponse({ status: 200, description: 'Estabelecimento removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Estabelecimento não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro ao remover o estabelecimento' })
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
