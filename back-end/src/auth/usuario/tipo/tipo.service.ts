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

  async findByIdkey(idkey: number): Promise<UsuarioTipo> {
    return await this.usuarioTipoRepository.findOne({ where: { idkey: idkey } });
  }

  async update(idkey: number, updateUsuarioTipoDto: UpdateUsuarioTipoDto): Promise<UsuarioTipo> {
    await this.usuarioTipoRepository.update(idkey, updateUsuarioTipoDto);
    return this.findByIdkey(idkey); 
  }

  async remove(idkey: number): Promise<void> {
    await this.usuarioTipoRepository.delete(idkey);
  }
}
