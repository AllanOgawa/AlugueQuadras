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
    return await this.usuarioRepository.find({relations: ['tipo']});
  }

  async findByIdkey(idkey: number): Promise<Usuario> {
    return await this.usuarioRepository.findOne({ 
      where: { idkey: idkey },
      relations: ['tipo']
    });
  }

  async findByEmail(email: string): Promise<Usuario> {
    return await this.usuarioRepository.findOne({ 
      where: { email: email },
      relations: ['tipo']
    });
  }

  async findByUsername(username: string): Promise<Usuario> {
    return await this.usuarioRepository.findOne({
      where: { username: username },
      relations: ['tipo'] 
    });
  }

  async update(idkey: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    await this.usuarioRepository.update(idkey, updateUsuarioDto);
    return this.findByIdkey(idkey);
  }

  async updatePassword(idkey: number, senhaNovaHashed: string): Promise<void> {
    await this.usuarioRepository.update(idkey, { senha: senhaNovaHashed });
  }

  async remove(idkey: number): Promise<void> {
    await this.usuarioRepository.delete(idkey);
  }
}
