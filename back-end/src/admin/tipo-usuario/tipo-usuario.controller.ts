import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { TipoUsuario } from './entities/tipo-usuario.entity';
import { TipoUsuarioService } from './tipo-usuario.service';
import { CreateTipoUsuarioDto } from './dto/create-tipo-usuario.dto';
import { UpdateTipoUsuarioDto } from './dto/update-tipo-usuario.dto';

@ApiTags('Tipo de Usuário')
@Controller('tipo-usuario')
export class TipoUsuarioController {
  constructor(private readonly tipoUsuarioService: TipoUsuarioService) {}

  @ApiBody({ description: 'Criação de um novo tipo de usuário.' })
  @Post()
  async create(@Body(ValidationPipe) createTipoUsuarioDto: CreateTipoUsuarioDto): Promise<TipoUsuario> {
    try {
      return await this.tipoUsuarioService.create(createTipoUsuarioDto);
    } catch (error) {
      throw new HttpException('Erro ao criar tipo de usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(): Promise<TipoUsuario[]> {
    try {
      return await this.tipoUsuarioService.findAll();
    } catch (error) {
      throw new HttpException('Erro ao buscar tipos de usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TipoUsuario> {
    try {
      const tipoUsuario = await this.tipoUsuarioService.findOne(+id);
      if (!tipoUsuario) {
        throw new HttpException('Tipo de usuário não encontrado', HttpStatus.NOT_FOUND);
      }
      return tipoUsuario;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        console.error('Erro ao buscar tipo de usuário:', error);
        throw new HttpException('Erro ao buscar tipo de usuário', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body(ValidationPipe) updateTipoUsuarioDto: UpdateTipoUsuarioDto): Promise<TipoUsuario> {
    try {
      await this.findOne(id);
      return await this.tipoUsuarioService.update(+id, updateTipoUsuarioDto);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        throw new HttpException('Erro ao atualizar tipo de usuário', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.tipoUsuarioService.remove(+id);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        throw new HttpException('Erro ao remover tipo de usuário', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
