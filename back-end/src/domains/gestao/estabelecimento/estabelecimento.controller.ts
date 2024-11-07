import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, ValidationPipe, HttpStatus, UseGuards, Request, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Estabelecimento } from './entities/estabelecimento.entity';
import { EstabelecimentoService } from './estabelecimento.service';
import { CreateEstabelecimentoDto } from './dto/create-estabelecimento.dto';
import { UpdateEstabelecimentoDto } from './dto/update-estabelecimento.dto';

import { JwtAuthGuard } from '@src/domains/auth/guard/jwt-auth.guard';
import { Quadra } from './quadra/entities/quadra.entity';
import { SearchEstabelecimentoDto } from './dto/search.dto';

@ApiTags('Estabelecimento')
@Controller('estabelecimento')
export class EstabelecimentoController {
  constructor(private readonly estabelecimentoService: EstabelecimentoService) { }

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

  @Get('list')
  @ApiOperation({ summary: 'Listar todos os estabelecimentos' })
  @ApiResponse({ status: 200, description: 'Lista de estabelecimentos', type: [Estabelecimento] })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findAll(): Promise<Estabelecimento[]> {
    try {
      return await this.estabelecimentoService.findAll();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro ao listar todos os estabelecimentos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar estabelecimentos por múltiplos critérios com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de estabelecimentos encontrados', type: [Estabelecimento] })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async search(@Query() query: SearchEstabelecimentoDto): Promise<{ data: Estabelecimento[]; total: number; page: number; limit: number }> {
    try {
      return await this.estabelecimentoService.searchByCriteria(query);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro ao buscar estabelecimentos com os critérios fornecidos', HttpStatus.INTERNAL_SERVER_ERROR);
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

  @Get(':idkey/quadras')
  @ApiOperation({ summary: 'Listar todas as quadras de um estabelecimento' })
  @ApiParam({ name: 'idkey', description: 'Identificador do estabelecimento', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de quadras', type: [Quadra] })
  @ApiResponse({ status: 404, description: 'Estabelecimento ou quadras não encontradas' })
  async findQuadrasByIdkeyEstabelecimento(@Param('idkey', ParseIntPipe) idkey: number): Promise<Quadra[]> {
    try {
      return await this.estabelecimentoService.findQuadrasByIdkeyEstabelecimento(idkey);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        console.error('Erro ao listar quadras:', error);
        throw new HttpException('Erro ao listar quadras', HttpStatus.INTERNAL_SERVER_ERROR);
      }
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
      await this.estabelecimentoService.findByIdkey(idkey);
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
      await this.estabelecimentoService.remove(idkey, usuario);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Erro ao remover estabelecimento', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
