import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAcomodacaoDto } from './dto/create-acomodacao.dto';
import { In } from 'typeorm';
import { Repository } from 'typeorm';
import { Acomodacao } from './entities/acomodacao.entity';
import { UpdateAcomodacaoDto } from './dto/update-acomodacao.dto';
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
      const createAcomodacao = await this.acomodacaoRepository.save(acomodacao);
      return createAcomodacao;
    } catch (error) {
      throw new HttpException(
        'Erro ao criar Acomodacao',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Acomodacao[]> {
    try {
      return await this.acomodacaoRepository.find();
    } catch (error) {
      throw new HttpException(
        'Erro ao buscaar Acomodacoes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByIdKey(idkey: number): Promise<Acomodacao> {
    try {
      const acomodacao = await this.acomodacaoRepository.findOne({
        where: { idkey },
      });

      if (!acomodacao) {
        throw new HttpException(
          'Acomodação não encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      return acomodacao;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Erro ao buscar acomodacao',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByIdKeys(idkeys: number[]): Promise<Acomodacao[]> {
    try {
      const acomodacao = await this.acomodacaoRepository.find({
        where: { idkey: In(idkeys) },
      });

      if (acomodacao.length === 0) {
        throw new HttpException(
          'Nenhuma acomodação foi encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      return acomodacao;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Erro ao buscar acomodações',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    idKey: number,
    updateData: UpdateAcomodacaoDto,
  ): Promise<Acomodacao> {
    try {
      const acomodacao = await this.findByIdKey(idKey);

      Object.assign(acomodacao, updateData);

      if (updateData.descricao && updateData.descricao.length > 0) {
        const acomods = await this.acomodacaoRepository.findBy({
          idkey: idKey,
        });
      }

      return await this.acomodacaoRepository.save(acomodacao);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao atualizar acomodação',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(idkey: number): Promise<void> {
    try {
      const acomodacao = await this.findByIdKey(idkey);

      await this.acomodacaoRepository.remove(acomodacao);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro ao deletar acomodação',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
