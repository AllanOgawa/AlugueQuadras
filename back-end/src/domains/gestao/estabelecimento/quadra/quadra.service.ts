import { In, Repository } from 'typeorm';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EstabelecimentoService } from '../estabelecimento.service';

import { Quadra }       from './entities/quadra.entity';
import { TipoEsporte }  from './tipo-esporte/entities/tipo-esporte.entity';

import { UpdateQuadraDto } from './dto/update-quadra.dto';
import { CreateQuadraDto } from './dto/create-quadra.dto';
import { TipoEsporteService } from './tipo-esporte/tipo-esporte.service';


@Injectable()
export class QuadraService {
  constructor(
    @InjectRepository(Quadra)
    private readonly quadraRepository: Repository<Quadra>,

    private readonly tipoEsporteService: TipoEsporteService,

    @Inject(forwardRef(() => EstabelecimentoService))
    private readonly estabelecimentoService: EstabelecimentoService,
  ) {}

  async create(createQuadraDto: CreateQuadraDto): Promise<Quadra> {

    let tiposEsporte = [];
    if (createQuadraDto.tiposEsporteToAdd && createQuadraDto.tiposEsporteToAdd.length > 0) {
      tiposEsporte = await this.tipoEsporteService.findByIdkeys(createQuadraDto.tiposEsporteToAdd);
    }

    const estabelecimento = await this.estabelecimentoService.findByIdkey(createQuadraDto.idkeyEstabelecimento);

    const quadra = this.quadraRepository.create({
      ...createQuadraDto,
      tiposEsporte,
      estabelecimento
    });
    try{
      return await this.quadraRepository.save(quadra);
    } catch (error) { 
      console.log(error)
      throw new HttpException('Erro ao criar Quadra', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

    // Processar Remoções de TipoEsporte
    if (updateData.tipoEsporteToRemove && updateData.tipoEsporteToRemove.length > 0) {
      const tiposEsporteToRemove = await this.tipoEsporteService.findByIdkeys(updateData.tipoEsporteToRemove);
      
      // Filtrar os tipos de esporte atuais para remover os especificados
      quadra.tiposEsporte = quadra.tiposEsporte.filter(te => !tiposEsporteToRemove.some(remTe => remTe.idkey === te.idkey));
    }

    // Processar Adições de TipoEsporte
    if (updateData.tipoEsporteToAdd && updateData.tipoEsporteToAdd.length > 0) {
      const tiposEsporteToAdd = await this.tipoEsporteService.findByIdkeys(updateData.tipoEsporteToAdd);
      
      // Adicionar os novos tipos de esporte, evitando duplicatas
      const existingTipoEsporteIds  = quadra.tiposEsporte.map(te => te.idkey);
      const novosTiposEsporte       = tiposEsporteToAdd.filter(te => !existingTipoEsporteIds.includes(te.idkey));
      quadra.tiposEsporte.push(...novosTiposEsporte);
    }

    const { tipoEsporteToAdd, tipoEsporteToRemove, ...otherFields } = updateData;
    Object.assign(quadra, otherFields);

    try {
      await this.quadraRepository.save(quadra);
      return this.findByIdkey(idkey);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro ao atualizar Quadra', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(idkey: number): Promise<void> {
    const quadra = await this.findByIdkey(idkey);
    await this.quadraRepository.remove(quadra);
  }
}