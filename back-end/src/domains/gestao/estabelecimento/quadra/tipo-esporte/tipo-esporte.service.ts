import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoEsporte } from './entities/tipo-esporte.entity';
import { DataSource, In, Repository } from 'typeorm';
import { CreateTipoEsporteDto } from './dto/create-tipo-esporte.dto';
import { UpdateTipoEsporteDto } from './dto/update-tipo-esporte.dto';
import { CreateTipoEsporteArrayDto } from './dto/create-array-tipo-esporte.dto';

@Injectable()
export class TipoEsporteService {
  constructor(
    @InjectRepository(TipoEsporte)
    private readonly tipoEsporteRepository: Repository<TipoEsporte>,
    private readonly dataSource: DataSource,
  ) { }

  async create(createTipoEsporteDto: CreateTipoEsporteDto): Promise<TipoEsporte> {
    try {
      const tipoEsporte = this.tipoEsporteRepository.create(createTipoEsporteDto);
      const createdTipoEsporte = await this.tipoEsporteRepository.save(tipoEsporte);
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
      const foundIds = tiposEsporte.map(te => te.idkey);
      const missingIds = idkeys.filter(id => !foundIds.includes(id));
      throw new HttpException(
        `Tipos de Esporte não encontrados para os idkeys: ${missingIds.join(', ')}`,
        HttpStatus.NOT_FOUND
      );
    }

    return tiposEsporte;
  }

  async createMultiple(
    createTipoEsporteArrayDto: CreateTipoEsporteArrayDto,
  ): Promise<TipoEsporte[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tiposEsporte = this.tipoEsporteRepository.create(
        createTipoEsporteArrayDto.tiposEsporte,
      );

      const createdTiposEsporte = await queryRunner.manager.save(tiposEsporte);

      await queryRunner.commitTransaction();
      return createdTiposEsporte;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === '23505') {
        throw new HttpException('Uma ou mais descrições já existem', HttpStatus.CONFLICT);
      }
      throw new HttpException('Erro ao criar Tipos de Esporte', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async update(idkey: number, updateTipoEsporteDto: UpdateTipoEsporteDto): Promise<TipoEsporte> {
    try {
      const tipoEsporte = await this.findByIdkey(idkey);
      Object.assign(tipoEsporte, updateTipoEsporteDto);
      const updatedTipoEsporte = await this.tipoEsporteRepository.save(tipoEsporte);
      return updatedTipoEsporte;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === '23505') {
        throw new HttpException('Descrição já existe', HttpStatus.CONFLICT);
      }
      throw new HttpException('Erro ao atualizar Tipo de Esporte', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(idkey: number): Promise<void> {
    try {
      const result = await this.tipoEsporteRepository.delete(idkey);
      if (result.affected === 0) {
        throw new HttpException('Tipo de Esporte não encontrado', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro ao deletar Tipo de Esporte', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
