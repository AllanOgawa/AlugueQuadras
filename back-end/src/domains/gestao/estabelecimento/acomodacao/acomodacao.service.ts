import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAcomodacaoDto } from './dto/create-acomodacao.dto';
import { In } from 'typeorm';
import { Repository } from 'typeorm';
import { Acomodacao } from './entities/acomodacao.entity';
import { UpdateAcomodacaoDto } from './dto/update-acomodacao.dto';


@Injectable()
export class AcomodacaoService {
  remove(arg0: number) {
    throw new Error('Method not implemented.');
  }
  update(arg0: number, updateAcomodacaoDto: UpdateAcomodacaoDto) {
    throw new Error('Method not implemented.');
  }
  findOne(arg0: number) {
    throw new Error('Method not implemented.');
  }

  constructor(
    @InjectableRepository(Acomodacao)
    private readonly acomodacaoRepository: Repository<Acomodacao>,
  ) { };


  async create(createAcomodacaoDto: CreateAcomodacaoDto): Promise<Acomodacao> {
    try {
      const acomodacao = this.acomodacaoRepository.create(createAcomodacaoDto);
      const createAcomodacao = await this.acomodacaoRepository.save(acomodacao)
      return createAcomodacao;
    } catch (error) {
      throw new HttpException('Erro ao criar Acomodacao', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<Acomodacao[]> {
    try {
      return await this.acomodacaoRepository.find();
    } catch (error) {
      import { In } from 'typeorm';

      throw new HttpException('Erro ao buscaar Acomodacoes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByIdKey(id: number): Promise<Acomodacao> {
    try {
      const acomodacao = await this.acomodacaoRepository.findOne({
        where: { idkey: id }
      });

      if (!acomodacao) {
        throw new HttpException('Acomodação não encontrada', HttpStatus.NOT_FOUND);
      }

      return acomodacao;

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Erro ao buscar acomodacao', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async findByIdKeys(idKeys: number[]): Promise<Acomodacao[]> {
    try {
      const acomodacao = await this.acomodacaoRepository.find({
        where: { idKey: In(idKeys) }
      });

      if (acomodacao.length === 0) {
        throw new HttpException('Nenhuma acomodação foi encontrada', HttpStatus.NOT_FOUND);
      }

      return acomodacao;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Erro ao buscar acomodações', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateAcomodacao(idKey: number, updateData: UpdateAcomodacaoDto): Promise<Acomodacao> {
    try {
      const acomodacao = await this.findByIdKey(idKey);
      Object.assign(acomodacao, updateData);

      if (!acomodacao) {
        throw new HttpException('Acomodacao não encontrada', HttpStatus.NOT_FOUND);
      }

      if (updateData.acomodacao && updateData.acomodacao.length > 0) {
        const acomods = await this.acomodacaoRepository.findBy({
          idKey: In(updateData.acomodacao),
        });
      }

      await this.acomodacaoRepository.save(acomodacao);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Erro ao atualizar acomodação', HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }
  async deleteAcomodacao(idKey: number): Promise<void> {
    try {
      const acomodacao = await this.findByIdKey(idKey);

      if (!acomodacao) {
        throw new HttpException('Acomodacao não encontrada', HttpStatus.NOT_FOUND);
      }

      await this.acomodacaoRepository.delete({ idKey });

    } catch (error) {
      if (error HttpException) {
        throw error;
      }
      throw new HttpException('Erro ao deletar acomodação', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeAcomodacao(id: number): Promise<void> {
    const acomodacao = await this.findByIdKey(id);
    if (!acomodacao) {
      throw new HttpException('Acomodação não encontrada', HttpStatus.NOT_FOUND);
    }
    await this.acomodacaoRepository.remove(acomodacao);
  }
  
  async updateAcomodacao(id: number, updateAcomodacaoDto: UpdateAcomodacaoDto): Promise<Acomodacao> {
    const acomodacao = await this.findByIdKey(id);
    if (!acomodacao) {
      throw new HttpException('Acomodação não encontrada', HttpStatus.NOT_FOUND);
    }
    Object.assign(acomodacao, updateAcomodacaoDto);
    return await this.acomodacaoRepository.save(acomodacao);
  }
  
}



function InjectableRepository(Acomodacao: typeof Acomodacao): (target: typeof AcomodacaoService, propertyKey: undefined, parameterIndex: 0) => void {
  throw new Error('Function not implemented.');
}