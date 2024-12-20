import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  ValidationPipe,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/domains/auth/guard/jwt-auth.guard';

import { Quadra } from './entities/quadra.entity';
import { QuadraService } from './quadra.service';
import { CreateQuadraDto } from './dto/create-quadra.dto';
import { UpdateQuadraDto } from './dto/update-quadra.dto';

@ApiTags('Quadra')
@Controller('estabelecimento/quadra')
export class QuadraController {
  constructor(private readonly quadraService: QuadraService) { }

  @Post('new')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Criar uma nova quadra' })
  @ApiResponse({
    status: 201,
    description: 'Quadra criada com sucesso',
    type: Quadra,
  })
  @ApiResponse({ status: 500, description: 'Erro ao criar quadra' })
  async create(
    @Body(ValidationPipe) createQuadraDto: CreateQuadraDto,
  ): Promise<Quadra> {
    try {
      return await this.quadraService.create(createQuadraDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Erro ao criar quadra',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get('search/:idkey')
  @ApiOperation({ summary: 'Buscar uma quadra por ID' })
  @ApiParam({
    name: 'idkey',
    description: 'ID da quadra a ser buscada',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Quadra encontrada', type: Quadra })
  @ApiResponse({ status: 404, description: 'Quadra não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro ao buscar quadra' })
  async findByIdkey(@Param('idkey') idkey: number): Promise<Quadra> {
    try {
      const quadra = await this.quadraService.findByIdkey(idkey);
      if (!quadra) {
        throw new HttpException('Quadra não encontrada', HttpStatus.NOT_FOUND);
      }
      return quadra;
    } catch (error) {
      if (error instanceof HttpException) {
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

  @Patch('edit/:idkey')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Atualizar uma quadra existente por ID' })
  @ApiParam({
    name: 'idkey',
    description: 'ID da quadra a ser atualizada',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Quadra atualizada com sucesso',
    type: Quadra,
  })
  @ApiResponse({ status: 404, description: 'Quadra não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro ao atualizar quadra' })
  async update(
    @Param('idkey') idkey: number,
    @Body(ValidationPipe) updateQuadraDto: UpdateQuadraDto,
  ): Promise<Quadra> {
    try {
      return await this.quadraService.update(idkey, updateQuadraDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Erro ao atualizar quadra',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Delete('remove/:idkey')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Remover uma quadra por ID' })
  @ApiParam({
    name: 'idkey',
    description: 'ID da quadra a ser removida',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Quadra removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Quadra não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro ao remover quadra' })
  async remove(@Param('idkey') idkey: number): Promise<void> {
    try {
      await this.findByIdkey(idkey);
      await this.quadraService.remove(idkey);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Erro ao remover quadra',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get('search/tipo-esporte/:tipoEsporteId')
  @ApiOperation({ summary: 'Buscar quadras por tipo de esporte' })
  @ApiParam({
    name: 'tipoEsporteId',
    description: 'ID do tipo de esporte para buscar quadras associadas',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de quadras filtradas pelo tipo de esporte',
    type: [Quadra],
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhuma quadra encontrada para o tipo de esporte',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao buscar quadras por tipo de esporte',
  })
  async findByTipoEsporte(
    @Param('tipoEsporteId', ParseIntPipe) tipoEsporteId: number,
  ): Promise<Quadra[]> {
    try {
      const quadras = await this.quadraService.findByTipoEsporte(tipoEsporteId);
      if (!quadras.length) {
        throw new HttpException(
          'Nenhuma quadra encontrada para o tipo de esporte',
          HttpStatus.NOT_FOUND,
        );
      }
      return quadras;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Erro ao buscar quadras por tipo de esporte',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
