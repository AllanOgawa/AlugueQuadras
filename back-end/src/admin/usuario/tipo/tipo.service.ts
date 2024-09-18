import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsuarioTipo } from './entities/tipo.entity';
import { CreateUsuarioTipoDto } from './dto/create-tipo.dto';
import { UpdateUsuarioTipoDto } from './dto/update-tipo.dto';

@Injectable()
export class UsuarioTipoService {
  constructor(
    @InjectRepository(UsuarioTipo)
    private readonly usuarioTipoRepository: Repository<UsuarioTipo>, 
  ) {}

  async create(createUsuarioTipoDto: CreateUsuarioTipoDto): Promise<UsuarioTipo> {
    const usuarioTipo = this.usuarioTipoRepository.create(createUsuarioTipoDto);
    return await this.usuarioTipoRepository.save(usuarioTipo);
  }

  async findAll(): Promise<UsuarioTipo[]> {
    return await this.usuarioTipoRepository.find();
  }

  async findOne(id: number): Promise<UsuarioTipo> {
    return await this.usuarioTipoRepository.findOne({ where: { idkey: id } });
  }

  async update(id: number, updateUsuarioTipoDto: UpdateUsuarioTipoDto): Promise<UsuarioTipo> {
    await this.usuarioTipoRepository.update(id, updateUsuarioTipoDto);
    return this.findOne(id); 
  }

  async remove(id: number): Promise<void> {
    await this.usuarioTipoRepository.delete(id);
  }
}
