import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoEsporte } from './entities/tipo-esporte.entity';
import { In, Repository } from 'typeorm';
import { CreateTipoEsporteDto } from './dto/create-tipo-esporte.dto';

@Injectable()
export class TipoEsporteService {
  constructor(
    @InjectRepository(TipoEsporte)
    private readonly tipoEsporteRepository: Repository<TipoEsporte>,
  ) {}

  async create(createTipoEsporteDto: CreateTipoEsporteDto): Promise<TipoEsporte> {
    try {
      const tipoEsporte         = this.tipoEsporteRepository.create(createTipoEsporteDto);
      const createdTipoEsporte  = await this.tipoEsporteRepository.save(tipoEsporte);
      return createdTipoEsporte;
    } catch (error) {
      throw new HttpException('Erro ao criar Tipo de Esporte', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<TipoEsporte[]> {
    try {
      return await this.tipoEsporteRepository.find();
    } catch (error) {
      throw new HttpException('Erro ao buscar Tipos de Esporte', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByIdkey(idkey: number): Promise<TipoEsporte> {
    try {
      const tipoEsporte = await this.tipoEsporteRepository.findOne({
        where: { idkey }
      });

      if (!tipoEsporte) {
        throw new HttpException('Tipo de Esporte não encontrado', HttpStatus.NOT_FOUND);
      }

      return tipoEsporte;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro ao buscar Tipo de Esporte', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByIdkeys(idkeys: number[]): Promise<TipoEsporte[]> {
    const tiposEsporte = await this.tipoEsporteRepository.find({
      where: { idkey: In(idkeys) },
    });

    if (tiposEsporte.length !== idkeys.length) {
      const foundIds    = tiposEsporte.map(te => te.idkey);
      const missingIds  = idkeys.filter(id => !foundIds.includes(id));
      throw new HttpException(
        `Tipos de Esporte não encontrados para os idkeys: ${missingIds.join(', ')}`,
        HttpStatus.NOT_FOUND
      );
    }

    return tiposEsporte;
  }
}
