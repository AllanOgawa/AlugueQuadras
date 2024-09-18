import { InjectRepository } from "@nestjs/typeorm";
import { Estabelecimento } from "./entities/estabelecimento.entity";
import { Repository } from "typeorm";
import { CreateEstabelecimentoDto } from "./dto/create-estabelecimento.dto";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class EstabelecimentoService{
  constructor(
    @InjectRepository(Estabelecimento)
    private readonly estabelecimentoRepository: Repository<Estabelecimento>,
  ){}

  async create(CreateEstabelecimentoDto: CreateEstabelecimentoDto): Promise<Estabelecimento>{
    const estabelecimento = await this.estabelecimentoRepository.create(CreateEstabelecimentoDto);
    return this.estabelecimentoRepository.save(estabelecimento);
  }

  async findAll(): Promise<Estabelecimento[]>{
    return await this.estabelecimentoRepository.find();
  }


  async findOne(id: number): Promise<Estabelecimento>{
    const estabelecimento =  await this.estabelecimentoRepository.findOne({where:{idKey: id}});
    if(!estabelecimento){
      throw new NotFoundException('Estabelecimento não encontrado');
    }
    return estabelecimento;
  }

  async update(id: number, data: Estabelecimento): Promise<Estabelecimento>{
    await this.estabelecimentoRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void>{
    const estabelecimento = await this.findOne(id);
    await this.estabelecimentoRepository.remove(estabelecimento);
  }
}