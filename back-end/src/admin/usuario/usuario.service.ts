import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>, 
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
      const usuario = this.usuarioRepository.create(createUsuarioDto);
      return await this.usuarioRepository.save(usuario);
    }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  async findOne(id: number): Promise<Usuario> {
    return await this.usuarioRepository.findOne({ where: { idkey: id } });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    await this.usuarioRepository.update(id, updateUsuarioDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usuarioRepository.delete(id);
  }
}
