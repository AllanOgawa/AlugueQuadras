import { In, Repository } from 'typeorm';
import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EstabelecimentoService } from '../estabelecimento.service';

import { Quadra } from './entities/quadra.entity';
import { TipoEsporte } from './tipo-esporte/entities/tipo-esporte.entity';

import { UpdateQuadraDto } from './dto/update-quadra.dto';
import { CreateQuadraDto } from './dto/create-quadra.dto';
import { TipoEsporteService } from './tipo-esporte/tipo-esporte.service';
import { ImagemService } from '@src/domains/storage/imagem/imagem.service';

@Injectable()
export class QuadraService {
  constructor(
    @InjectRepository(Quadra)
    private readonly quadraRepository: Repository<Quadra>,

    private readonly tipoEsporteService: TipoEsporteService,

    @Inject(forwardRef(() => EstabelecimentoService))
    private readonly estabelecimentoService: EstabelecimentoService,

    private readonly imagemService: ImagemService
  ) { }

  async create(createQuadraDto: CreateQuadraDto): Promise<Quadra> {
    let quadra: Quadra;
    let novasImagens = [];
    let tiposEsporte = [];

    if (createQuadraDto.tiposEsporteToAdd && createQuadraDto.tiposEsporteToAdd.length > 0) {
      tiposEsporte = await this.tipoEsporteService.findByIdkeys(createQuadraDto.tiposEsporteToAdd);
    }

    const estabelecimento = await this.estabelecimentoService.findByIdkey(createQuadraDto.idkeyEstabelecimento);

    try {
      quadra = this.quadraRepository.create({
        ...createQuadraDto,
        tiposEsporte,
        estabelecimento
      });
      await this.quadraRepository.save(quadra);
    } catch (error) {
      console.log(error)
      throw new HttpException('Erro ao criar Quadra', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (createQuadraDto.imagensToAdd && createQuadraDto.imagensToAdd.length > 0) {
      try {
        novasImagens = await this.imagemService.createImagens(createQuadraDto.imagensToAdd);

        await this.quadraRepository
          .createQueryBuilder()
          .relation(Quadra, 'imagens')
          .of(quadra)
          .add(novasImagens);
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Erro ao associar imagens a quadra.');
      }
    }

    return this.findByIdkey(quadra.idkey);
  }

  async findByIdkey(idkey: number): Promise<Quadra> {
    const quadra = await this.quadraRepository.findOne({
      where: { idkey }
    });
    if (!quadra) {
      throw new NotFoundException(`Quadra com idkey ${idkey} não encontrada`);
    }
    return quadra;
  }

  async manageImages(quadra: Quadra, imagensToAdd?: string[], imagensToRemove?: string[]): Promise<void> {

    if (imagensToAdd && imagensToAdd.length > 0) {
      try {
        const imagensExistentes = quadra.imagens.map(imagem => imagem.path);
        const novasImagensParaAdicionar = imagensToAdd.filter(caminho => !imagensExistentes.includes(caminho));

        if (novasImagensParaAdicionar.length > 0) {
          const imagensEntities = await this.imagemService.createImagens(novasImagensParaAdicionar);
          await this.quadraRepository
            .createQueryBuilder()
            .relation(Quadra, 'imagens')
            .of(quadra)
            .add(imagensEntities);
        }
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Erro ao adicionar imagens à quadra.');
      }
    }

    if (imagensToRemove && imagensToRemove.length > 0) {
      try {
        const imagensParaRemover = await this.imagemService.searchPathsImagens(imagensToRemove);
        await this.quadraRepository
          .createQueryBuilder()
          .relation(Quadra, 'imagens')
          .of(quadra)
          .remove(imagensParaRemover);
        await this.imagemService.removeImagens(imagensToRemove);
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Erro ao remover imagens do estabelecimento.');
      }
    }
  }

  async manageTipoEsporte(quadra: Quadra, tiposEsporteToAdd?: number[], tiposEsporteToRemove?: number[]): Promise<Quadra> {
    if (tiposEsporteToAdd && tiposEsporteToAdd.length > 0) {
      try {
        const tiposEsporteEntities = await this.tipoEsporteService.findByIdkeys(tiposEsporteToAdd);

        // Obter os IDs dos tipos de esporte já associados
        const existingTipoEsporteIds = quadra.tiposEsporte.map(te => te.idkey);

        // Filtrar para evitar duplicações
        const novosTiposEsporte = tiposEsporteEntities.filter(te => !existingTipoEsporteIds.includes(te.idkey));

        if (novosTiposEsporte.length > 0) {
          await this.quadraRepository
            .createQueryBuilder()
            .relation(Quadra, 'tiposEsporte')
            .of(quadra)
            .add(novosTiposEsporte);
        }
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Erro ao adicionar tipos de esporte à quadra.');
      }
    }

    if (tiposEsporteToRemove && tiposEsporteToRemove.length > 0) {
      try {
        const tiposEsporteEntities = await this.tipoEsporteService.findByIdkeys(tiposEsporteToRemove);

        await this.quadraRepository
          .createQueryBuilder()
          .relation(Quadra, 'tiposEsporte')
          .of(quadra)
          .remove(tiposEsporteEntities);
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Erro ao remover tipos de esporte da quadra.');
      }
    }

    return quadra;
  }

  async updateFields(idkey: number, updateQuadraDto: UpdateQuadraDto): Promise<void> {
    const {
      nome,
      informacoesAdicionais,
      valor,
      largura,
      comprimento,
      ...otherFields } = updateQuadraDto;

    const updateData: Partial<Quadra> = {};
    if (nome) updateData.nome = nome;
    if (informacoesAdicionais) updateData.informacoesAdicionais = informacoesAdicionais;
    if (valor) updateData.valor = valor;
    if (largura) updateData.largura = largura;
    if (comprimento) updateData.comprimento = comprimento;

    try {
      await this.quadraRepository.update(idkey, updateData);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao atualizar quadra (possível duplicação de campos únicos).',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(idkey: number, updateQuadraDto: UpdateQuadraDto): Promise<Quadra> {
    // Buscar a quadra atual com as relações
    const quadra = await this.findByIdkey(idkey);

    // Gerenciar os tipos de esporte
    const { tipoEsporteToAdd, tipoEsporteToRemove } = updateQuadraDto;
    await this.manageTipoEsporte(quadra, tipoEsporteToAdd, tipoEsporteToRemove);

    // Gerenciar as imagens
    const { imagensToAdd, imagensToRemove } = updateQuadraDto;
    await this.manageImages(quadra, imagensToAdd, imagensToRemove);

    // Atualizar os campos da quadra
    await this.updateFields(idkey, updateQuadraDto);

    return this.findByIdkey(idkey);
  }

  async remove(idkey: number): Promise<void> {
    const quadra = await this.findByIdkey(idkey);
    await this.quadraRepository.remove(quadra);
  }
}