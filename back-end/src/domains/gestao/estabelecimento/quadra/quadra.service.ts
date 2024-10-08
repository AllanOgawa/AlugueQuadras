import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuadraDto } from './dto/create-quadra.dto';
import { UpdateQuadraDto } from './dto/update-quadra.dto';
import { Quadra } from './entities/quadra.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QuadraService {
  constructor(
    @InjectRepository(Quadra)
    private readonly quadraRepository: Repository<Quadra>,
  ) {}

  async create(createQuadraDto: CreateQuadraDto): Promise<Quadra> {
    const quadra = this.quadraRepository.create(createQuadraDto);
    return await this.quadraRepository.save(quadra);
  }

  async findAll(): Promise<Quadra[]> {
    return await this.quadraRepository.find({
      relations: ['estabelecimento'],
    });
  }

  async findByIdkey(idkey: number): Promise<Quadra> {
    const quadra = await this.quadraRepository.findOne({
      where: { idkey },
      relations: ['estabelecimento'],
    });
    if (!quadra) {
      throw new NotFoundException(`Quadra com id ${idkey} não encontrada`);
    }
    return quadra;
  }

  async update(idkey: number, updateData: Partial<Quadra>): Promise<Quadra> {
    await this.quadraRepository.update(idkey, updateData);
    return this.findByIdkey(idkey);
  }

  async remove(idkey: number): Promise<void> {
    const quadra = await this.findByIdkey(idkey);
    await this.quadraRepository.remove(quadra);
  }
}