import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAcomodacaoDto } from './dto/create-acomodacao.dto';
import { UpdateAcomodacaoDto } from './dto/update-acomodacao.dto';
import { In, Repository } from 'typeorm';
import { Acomodacao } from './entities/acomodacao.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AcomodacaoService {
  constructor(
    @InjectRepository(Acomodacao)
    private readonly acomodacaoRepository: Repository<Acomodacao>,
  ) {}

  async create(createAcomodacaoDto: CreateAcomodacaoDto): Promise<Acomodacao> {
    try {
      const acomodacao = this.acomodacaoRepository.create(createAcomodacaoDto);
      return await this.acomodacaoRepository.save(acomodacao);
    } catch (error) {
      throw new HttpException(
        'Erro ao criar Acomodação',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Acomodacao[]> {
    try {
      return await this.acomodacaoRepository.find();
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar Acomodações',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByIdKey(id: number): Promise<Acomodacao> {
    try {
      const acomodacao = await this.acomodacaoRepository.findOne({
        where: { idkey: id },
      });

      if (!acomodacao) {
        throw new HttpException(
          'Acomodação não encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      return acomodacao;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar acomodação',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByIdKeys(idKeys: number[]): Promise<Acomodacao[]> {
    try {
      const acomodacoes = await this.acomodacaoRepository.find({
        where: { idkey: In(idKeys) },
      });

      if (acomodacoes.length === 0) {
        throw new HttpException(
          'Nenhuma acomodação foi encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      return acomodacoes;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar acomodações',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: number,
    updateAcomodacaoDto: UpdateAcomodacaoDto,
  ): Promise<Acomodacao> {
    try {
      const acomodacao = await this.findByIdKey(id);

      if (!acomodacao) {
        throw new HttpException(
          'Acomodação não encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      Object.assign(acomodacao, updateAcomodacaoDto);
      return await this.acomodacaoRepository.save(acomodacao);
    } catch (error) {
      throw new HttpException(
        'Erro ao atualizar acomodação',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const acomodacao = await this.findByIdKey(id);

      if (!acomodacao) {
        throw new HttpException(
          'Acomodação não encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.acomodacaoRepository.delete(id);
    } catch (error) {
      throw new HttpException(
        'Erro ao deletar acomodação',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<void> {
    const acomodacao = await this.findByIdKey(id);
    if (!acomodacao) {
      throw new HttpException(
        'Acomodação não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.acomodacaoRepository.remove(acomodacao);
  }
}
