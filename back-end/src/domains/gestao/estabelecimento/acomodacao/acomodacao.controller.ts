import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AcomodacaoService } from './acomodacao.service';
import { CreateAcomodacaoDto } from './dto/create-acomodacao.dto';
import { UpdateAcomodacaoDto } from './dto/update-acomodacao.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/domains/auth/guard/jwt-auth.guard';
import { Acomodacao } from './entities/acomodacao.entity';
import { Quadra } from '../quadra/entities/quadra.entity';

@ApiTags('Acomodacao')
@Controller('estabelecimento/acomodacao')
@UseGuards(JwtAuthGuard)
export class AcomodacaoController {
  constructor(private readonly acomodacaoService: AcomodacaoService) {}

  @Post('new')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Criar uma nova acomodacao' })
  @ApiResponse({
    status: 201,
    description: 'Acomodacao criada com sucesso',
    type: Acomodacao,
  })
  @ApiResponse({ status: 500, description: 'Erro ao criar acomodacao' })
  async create(@Body(ValidationPipe) createAcomodacaoDto: CreateAcomodacaoDto) {
    try {
      return this.acomodacaoService.create(createAcomodacaoDto);
    } catch (error) {
      throw new HttpException(
        'Error ao criar acomodacao',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('list')
  @ApiOperation({
    summary: 'Buscar todas as acomodacoes com campos específicos',
  })
  @ApiResponse({
    status: 200,
    description: 'Acomodacoes encontradas',
    type: Acomodacao,
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'Acomodacoes não encontradas' })
  @ApiResponse({ status: 500, description: 'Erro ao buscar acomodacoes' })
  async findAll(): Promise<Partial<Acomodacao>[]> {
    try {
      return this.acomodacaoService.findAll();
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar acomodacoes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('search/:idkey')
  @ApiOperation({ summary: 'Buscar acomodacao por ID' })
  @ApiParam({
    name: 'idkey',
    description: 'ID da acomodacao a ser buscada',
    example: 55,
  })
  @ApiResponse({
    status: 200,
    description: 'Acomodacao encontrada',
    type: Acomodacao,
  })
  @ApiResponse({ status: 404, description: 'Acomodacao não encontrada' })
  @ApiResponse({ status: 50, description: 'Erro ao buscar acomodacao' })
  async findByIdKey(@Param('id') id: number) {
    try {
      return await this.acomodacaoService.findByIdKey(id);
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar acomodacao',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('edit/:idkey')
  @ApiOperation({ summary: 'Atualizar uma acomodacao por ID' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('acess-token')
  @ApiParam({
    name: 'idKey',
    description: 'ID da quadra a ser atualizada',
    example: 22,
  })
  @ApiResponse({
    status: 200,
    description: 'Acomodacao atualizada com sucesso',
    type: Quadra,
  })
  @ApiResponse({ status: 404, description: 'Acomodacao não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro ao atualizar acomodacao' })
  async update(
    @Param('idkey') id: number,
    @Body(ValidationPipe) updateAcomodacaoDto: UpdateAcomodacaoDto,
  ): Promise<Acomodacao> {
    try {
      return this.acomodacaoService.update(+id, updateAcomodacaoDto);
    } catch (error) {
      throw new HttpException(
        'Erro ao atualizar acomodacao',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('remove/:idkey')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Remover uma acomodacao por ID' })
  @ApiParam({
    name: 'idkey',
    description: 'ID da acomodacao a ser removido',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Acomodacao removida com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Acomodacao não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro ao remover acomodacao' })
  remove(@Param('idkey') id: number) {
    try {
      return this.acomodacaoService.remove(id);
    } catch (error) {
      throw new HttpException(
        'Erro ao remover acomodacao',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
