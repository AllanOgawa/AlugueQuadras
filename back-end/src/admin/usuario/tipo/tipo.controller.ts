  import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
  import { ApiBody, ApiTags } from '@nestjs/swagger';

  import { UsuarioTipo } from './entities/tipo.entity';
  import { UsuarioTipoService } from './tipo.service';
  import { CreateUsuarioTipoDto } from './dto/create-tipo.dto';
  import { UpdateUsuarioTipoDto } from './dto/update-tipo.dto';

  @ApiTags('Tipo de Usuário')
  @Controller('usuario/tipo')
  export class UsuarioTipoController {
    constructor(private readonly tipoUsuarioService: UsuarioTipoService) {}

    @ApiBody({ description: 'Criação de um novo tipo de usuário.' })
    @Post()
    async create(@Body(ValidationPipe) createUsuarioTipoDto: CreateUsuarioTipoDto): Promise<UsuarioTipo> {
      try {
        return await this.tipoUsuarioService.create(createUsuarioTipoDto);
      } catch (error) {
        throw new HttpException('Erro ao criar tipo de usuário', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @Get()
    async findAll(): Promise<UsuarioTipo[]> {
      try {
        return await this.tipoUsuarioService.findAll();
      } catch (error) {
        throw new HttpException('Erro ao buscar tipos de usuário', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    @Get(':idkey')
    async findOne(@Param('idkey') idkey: string): Promise<UsuarioTipo> {
      try {
        const tipoUsuario = await this.tipoUsuarioService.findByIdkey(+idkey);
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

    @Patch(':idkey')
    async update(@Param('idkey') idkey: string, @Body(ValidationPipe) updateUsuarioTipoDto: UpdateUsuarioTipoDto): Promise<UsuarioTipo> {
      try {
        await this.findOne(idkey);
        return await this.tipoUsuarioService.update(+idkey, updateUsuarioTipoDto);
      } catch (error) {
        if (error.status === HttpStatus.NOT_FOUND) {
          throw error;
        } else {
          throw new HttpException('Erro ao atualizar tipo de usuário', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    }

    @Delete(':idkey')
    async remove(@Param('idkey') idkey: string): Promise<void> {
      try {
        await this.findOne(idkey);
        await this.tipoUsuarioService.remove(+idkey);
      } catch (error) {
        if (error.status === HttpStatus.NOT_FOUND) {
          throw error;
        } else {
          throw new HttpException('Erro ao remover tipo de usuário', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
    }
  }
