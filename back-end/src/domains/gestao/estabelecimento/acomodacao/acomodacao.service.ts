import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAcomodacaoDto } from './dto/create-acomodacao.dto';
import { DataSource, In, Repository } from 'typeorm';
import { Acomodacao } from './entities/acomodacao.entity';
import { UpdateAcomodacaoDto } from './dto/update-acomodacao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAcomodacaoArrayDto } from './dto/create-array-acomodacao.dto';

@Injectable()
export class AcomodacaoService {
  constructor(
    @InjectRepository(Acomodacao)
    private readonly acomodacaoRepository: Repository<Acomodacao>,
    private readonly dataSource: DataSource,
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

  async createMultiple(
    createAcomodacaoArrayDto: CreateAcomodacaoArrayDto,
  ): Promise<Acomodacao[]> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const acomodacoes = this.acomodacaoRepository.create(
        createAcomodacaoArrayDto.acomodacoes,
      );

      const createdAcomodacoes = await queryRunner.manager.save(acomodacoes);

      await queryRunner.commitTransaction();
      return createdAcomodacoes;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === '23505') { // Violação de chave única
        throw new HttpException('Uma ou mais acomodações já existem', HttpStatus.CONFLICT);
      }
      throw new HttpException('Erro ao criar Acomodações', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
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
      const acomodacao = await this.findByIdkey(idkey);
      Object.assign(acomodacao, updateAcomodacaoDto);

      const updatedAcomodacao = await this.acomodacaoRepository.save(acomodacao);
      return updatedAcomodacao;
    } catch (error) {
      console.log(error)
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
