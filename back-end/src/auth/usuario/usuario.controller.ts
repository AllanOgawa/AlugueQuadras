import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { Usuario } from './entities/usuario.entity';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

import { JwtAuthGuard } from '@/src/auth/guard/jwt-auth.guard';

@ApiTags('Usuário')
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  // @ApiBody({ description: 'Criação de um novo usuário.' })
  // @Post()
  // async create(@Body(ValidationPipe) createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
  //   try {
  //     return await this.usuarioService.create(createUsuarioDto);
  //   } catch (error) {
  //     throw new HttpException('Erro ao criar usuário', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get()
  // async findAll(): Promise<Usuario[]> {
  //   try {
  //     return await this.usuarioService.findAll();
  //   } catch (error) {
  //     throw new HttpException('Erro ao buscar usuários', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get(':idkey')
  // async findByIdkey(@Param('idkey') idkey: string): Promise<Usuario> {
  //   try {
  //     const usuario = await this.usuarioService.findByIdkey(+idkey);
  //     if (!usuario) 
  //       {
  //       throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
  //     }
  //     return usuario;
  //   } catch (error) {
  //       if (error.status === HttpStatus.NOT_FOUND) {
  //         throw error;
  //       } else {
  //         console.error('Erro ao buscar usuário:', error);
  //         throw new HttpException('Erro ao buscar usuário', HttpStatus.INTERNAL_SERVER_ERROR);
  //       }
  //   }
  // }

  // @Delete(':idkey')
  // async remove(@Param('idkey') idkey: string): Promise<void> {
  //   try {
  //     await this.findByIdkey(idkey);
  //     await this.usuarioService.remove(+idkey);
  //   } catch (error) {
  //     if (error.status === HttpStatus.NOT_FOUND) {
  //       throw error;
  //     } else {
  //     throw new HttpException('Erro ao remover usuário', HttpStatus.INTERNAL_SERVER_ERROR);
  //     }
  //   }
  // }
}
