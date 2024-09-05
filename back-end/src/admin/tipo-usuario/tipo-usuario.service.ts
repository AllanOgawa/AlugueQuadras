import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TipoUsuario } from './entities/tipo-usuario.entity';
import { CreateTipoUsuarioDto } from './dto/create-tipo-usuario.dto';
import { UpdateTipoUsuarioDto } from './dto/update-tipo-usuario.dto';

@Injectable()
export class TipoUsuarioService {
  constructor(
    @InjectRepository(TipoUsuario)
    private readonly tipoUsuarioRepository: Repository<TipoUsuario>, 
  ) {}

  async create(createTipoUsuarioDto: CreateTipoUsuarioDto): Promise<TipoUsuario> {
    const tipoUsuario = this.tipoUsuarioRepository.create(createTipoUsuarioDto);
    return await this.tipoUsuarioRepository.save(tipoUsuario);
  }

  async findAll(): Promise<TipoUsuario[]> {
    return await this.tipoUsuarioRepository.find();
  }

  async findOne(id: number): Promise<TipoUsuario> {
    return await this.tipoUsuarioRepository.findOne({ where: { idkey: id } });
  }

  async update(id: number, updateTipoUsuarioDto: UpdateTipoUsuarioDto): Promise<TipoUsuario> {
    await this.tipoUsuarioRepository.update(id, updateTipoUsuarioDto);
    return this.findOne(id); 
  }

  async remove(id: number): Promise<void> {
    await this.tipoUsuarioRepository.delete(id);
  }
}
