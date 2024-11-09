import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Endereco } from './entities/endereco.entity';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';

@Injectable()
export class EnderecoService {
  constructor(
    @InjectRepository(Endereco)
    private enderecoRepository: Repository<Endereco>,
  ) { }

  async create(createEnderecoDto: CreateEnderecoDto): Promise<Endereco> {
    const endereco = this.enderecoRepository.create(createEnderecoDto);
    return this.enderecoRepository.save(endereco);
  }

  async findOne(idkey: number): Promise<Endereco> {
    const endereco = await this.enderecoRepository.findOne({ where: { idkey } });
    if (!endereco) {
      throw new NotFoundException(`Endereço com ID ${idkey} não encontrado.`);
    }
    return endereco;
  }

  async update(idkey: number, updateEnderecoDto: UpdateEnderecoDto): Promise<Endereco> {
    const endereco = await this.findOne(idkey);
    Object.assign(endereco, updateEnderecoDto);
    return this.enderecoRepository.save(endereco);
  }

  async remove(idkey: number): Promise<void> {
    const endereco = await this.findOne(idkey);
    try {
      await this.enderecoRepository.remove(endereco);
    } catch (error) {
      throw new Error('Erro ao remover endereço');
    }
  }
}
