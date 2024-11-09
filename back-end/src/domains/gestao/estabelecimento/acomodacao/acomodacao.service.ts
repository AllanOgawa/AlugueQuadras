import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAcomodacaoDto } from './dto/create-acomodacao.dto';
import { In, Repository } from 'typeorm';
import { Acomodacao } from './entities/acomodacao.entity';
import { UpdateAcomodacaoDto } from './dto/update-acomodacao.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AcomodacaoService {
  constructor(
    @InjectRepository(Acomodacao)
    private readonly acomodacaoRepository: Repository<Acomodacao>,
  ) { }

  async create(createAcomodacaoDto: CreateAcomodacaoDto): Promise<Acomodacao> {
    try {
      const acomodacao = this.acomodacaoRepository.create(createAcomodacaoDto);
      const createdAcomodacao = await this.acomodacaoRepository.save(acomodacao);
      return createdAcomodacao;
    } catch (error) {
      throw new HttpException('Erro ao criar Acomodação', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<Acomodacao[]> {
    try {
      return await this.acomodacaoRepository.find();
    } catch (error) {
      throw new HttpException('Erro ao buscar Acomodações', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByIdkey(idkey: number): Promise<Acomodacao> {
    try {
      const acomodacao = await this.acomodacaoRepository.findOne({
        where: { idkey }
      });

      if (!acomodacao) {
        throw new HttpException('Acomodação não encontrada', HttpStatus.NOT_FOUND);
      }

      return acomodacao;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro ao buscar Acomodação', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByIdkeys(idkeys: number[]): Promise<Acomodacao[]> {
    const acomodacoes = await this.acomodacaoRepository.find({
      where: { idkey: In(idkeys) },
    });

    if (acomodacoes.length !== idkeys.length) {
      const foundIds = acomodacoes.map(a => a.idkey);
      const missingIds = idkeys.filter(id => !foundIds.includes(id));
      throw new HttpException(
        `Acomodações não encontradas para os idkeys: ${missingIds.join(', ')}`,
        HttpStatus.NOT_FOUND
      );
    }

    return acomodacoes;
  }

  async update(idkey: number, updateAcomodacaoDto: UpdateAcomodacaoDto): Promise<Acomodacao> {
    try {
      const acomodacao = await this.acomodacaoRepository.preload({
        idkey,
        ...updateAcomodacaoDto,
      });

      if (!acomodacao) {
        throw new HttpException('Acomodação não encontrada', HttpStatus.NOT_FOUND);
      }

      return await this.acomodacaoRepository.save(acomodacao);
    } catch (error) {
      throw new HttpException('Erro ao atualizar Acomodação', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(idkey: number): Promise<void> {
    try {
      const acomodacao = await this.findByIdkey(idkey);
      await this.acomodacaoRepository.remove(acomodacao);
    } catch (error) {
      throw new HttpException('Erro ao remover Acomodação', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
