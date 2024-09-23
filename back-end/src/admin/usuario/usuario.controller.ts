import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { Usuario } from './entities/usuario.entity';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@ApiTags('Usuário')
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @ApiBody({ description: 'Criação de um novo usuário.' })
  @Post()
  async create(@Body(ValidationPipe) createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      return await this.usuarioService.create(createUsuarioDto);
    } catch (error) {
      throw new HttpException('Erro ao criar usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(): Promise<Usuario[]> {
    try {
      return await this.usuarioService.findAll();
    } catch (error) {
      throw new HttpException('Erro ao buscar usuários', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Usuario> {
    try {
      const usuario = await this.usuarioService.findOne(+id);
      if (!usuario) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }
      return usuario;
    } catch (error) {
        if (error.status === HttpStatus.NOT_FOUND) {
          throw error;
        } else {
          console.error('Erro ao buscar usuário:', error);
          throw new HttpException('Erro ao buscar usuário', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body(ValidationPipe) updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    try {
      await this.findOne(id);
      return await this.usuarioService.update(+id, updateUsuarioDto);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
        throw new HttpException('Erro ao atualizar usuário', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.usuarioService.remove(+id);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw error;
      } else {
      throw new HttpException('Erro ao remover usuário', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
