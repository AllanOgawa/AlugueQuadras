import { Controller, Get, UseGuards, HttpException, HttpStatus, Post, Body, Put, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/domains/auth/guard/jwt-auth.guard';

import { TipoEsporteService } from './tipo-esporte.service';
import { TipoEsporte } from './entities/tipo-esporte.entity';
import { CreateTipoEsporteDto } from './dto/create-tipo-esporte.dto';
import { UpdateTipoEsporteDto } from './dto/update-tipo-esporte.dto';
import { CreateTipoEsporteArrayDto } from './dto/create-array-tipo-esporte.dto';

@ApiTags('Tipo Esporte')
@UseGuards(JwtAuthGuard)
@Controller('estabelecimento/quadra/tipo-esporte')
export class TipoEsporteController {
  constructor(private readonly tipoEsporteService: TipoEsporteService) { }

  @Post('new')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Criar um novo Tipo de Esporte' })
  @ApiResponse({ status: 201, description: 'Tipo de Esporte criado com sucesso', type: TipoEsporte })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Descrição já existe' })
  @ApiResponse({ status: 500, description: 'Erro ao criar Tipo de Esporte' })
  async create(
    @Body() createTipoEsporteDto: CreateTipoEsporteDto,
  ): Promise<TipoEsporte> {
    try {
      return await this.tipoEsporteService.create(createTipoEsporteDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('new/array')
  @ApiOperation({ summary: 'Criar novos Tipos de Esporte em lote' })
  @ApiResponse({ status: 201, description: 'Tipos de Esporte criados com sucesso', type: TipoEsporte, isArray: true })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Uma ou mais descrições já existem' })
  @ApiResponse({ status: 500, description: 'Erro ao criar Tipos de Esporte' })
  async createArray(
    @Body() createTipoEsporteArrayDto: CreateTipoEsporteArrayDto,
  ): Promise<TipoEsporte[]> {
    try {
      return await this.tipoEsporteService.createMultiple(createTipoEsporteArrayDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('list')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Buscar todos Tipos Esportes' })
  @ApiResponse({ status: 200, description: 'Tipos Esportes encontrado', type: TipoEsporte, isArray: true })
  @ApiResponse({ status: 500, description: 'Erro ao buscar Tipo Esporte' })
  async findAll(): Promise<TipoEsporte[]> {
    try {
      return await this.tipoEsporteService.findAll();
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('edit/:idkey')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Atualizar um Tipo de Esporte existente' })
  @ApiResponse({ status: 200, description: 'Tipo de Esporte atualizado com sucesso', type: TipoEsporte })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Tipo de Esporte não encontrado' })
  @ApiResponse({ status: 409, description: 'Descrição já existe' })
  @ApiResponse({ status: 500, description: 'Erro ao atualizar Tipo de Esporte' })
  async update(
    @Param('idkey', ParseIntPipe) idkey: number,
    @Body() updateTipoEsporteDto: UpdateTipoEsporteDto,
  ): Promise<TipoEsporte> {
    try {
      return await this.tipoEsporteService.update(idkey, updateTipoEsporteDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('remove/:idkey')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Deletar um Tipo de Esporte existente' })
  @ApiResponse({ status: 200, description: 'Tipo de Esporte deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Tipo de Esporte não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro ao deletar Tipo de Esporte' })
  async remove(
    @Param('idkey', ParseIntPipe) idkey: number,
  ): Promise<{ message: string }> {
    try {
      await this.tipoEsporteService.remove(idkey);
      return { message: 'Tipo de Esporte deletado com sucesso' };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
