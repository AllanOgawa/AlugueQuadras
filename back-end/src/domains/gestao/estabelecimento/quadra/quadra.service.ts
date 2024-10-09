import { In, Repository } from 'typeorm';
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EstabelecimentoService } from '../estabelecimento.service';

import { Quadra } from './entities/quadra.entity';
import { TipoEsporte } from './entities/tipo-esporte.entity';

import { UpdateQuadraDto } from './dto/update-quadra.dto';
import { CreateQuadraDto } from './dto/create-quadra.dto';


@Injectable()
export class QuadraService {
  constructor(
    @InjectRepository(Quadra)
    private readonly quadraRepository: Repository<Quadra>,

    @InjectRepository(TipoEsporte)
    private readonly tipoEsporteRepository: Repository<TipoEsporte>,

    @Inject(forwardRef(() => EstabelecimentoService))
    private readonly estabelecimentoService: EstabelecimentoService,
  ) {}

  async create(createQuadraDto: CreateQuadraDto): Promise<Quadra> {

    // Recupera os tipos de esporte
    let tiposEsporte = [];
    if (createQuadraDto.tiposEsporte && createQuadraDto.tiposEsporte.length > 0) {
      tiposEsporte = await this.tipoEsporteRepository.findBy({
        idkey: In(createQuadraDto.tiposEsporte), 
      });
    }

    // Recupera o Estabelecimento
    const estabelecimento = await this.estabelecimentoService.findByIdkey(createQuadraDto.idkeyEstabelecimento);

    const quadra = this.quadraRepository.create({
      ...createQuadraDto,
      tiposEsporte,
      estabelecimento
    });
  
    return await this.quadraRepository.save(quadra);
  }

  async findByIdkey(idkey: number): Promise<Quadra> {
    const quadra = await this.quadraRepository.findOne({
      where: { idkey }
    });
    if (!quadra) {
      throw new NotFoundException(`Quadra com id ${idkey} não encontrada`);
    }
    return quadra;
  }

  async update(idkey: number, updateData: UpdateQuadraDto): Promise<Quadra> {
    const quadra = await this.findByIdkey(idkey);

    // remove todos os vinculos many to many antes de atribuir novos valores, isso evita ferir constraints
    quadra.tiposEsporte = [];
    await this.quadraRepository.save(quadra);

    if (updateData.tiposEsporte && updateData.tiposEsporte.length > 0) {
      const tiposEsporte = await this.tipoEsporteRepository.findBy({
        idkey: In(updateData.tiposEsporte),
      });
      quadra.tiposEsporte = tiposEsporte; 
    }

    const { tiposEsporte, ...otherFields } = updateData;
    Object.assign(quadra, otherFields);

    await this.quadraRepository.save(quadra);
    return this.findByIdkey(idkey);
  }

  async remove(idkey: number): Promise<void> {
    const quadra = await this.findByIdkey(idkey);
    await this.quadraRepository.remove(quadra);
  }
}