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


  async findOne(idkey: number): Promise<Estabelecimento>{
    const estabelecimento =  await this.estabelecimentoRepository.findOne({where:{idKey: idkey}});
    if(!estabelecimento){
      throw new NotFoundException('Estabelecimento não encontrado');
    }
    return estabelecimento;
  }

  async update(idkey: number, data: Estabelecimento): Promise<Estabelecimento>{
    await this.estabelecimentoRepository.update(idkey, data);
    return this.findOne(idkey);
  }

  async remove(idkey: number): Promise<void>{
    const estabelecimento = await this.findOne(idkey);
    await this.estabelecimentoRepository.remove(estabelecimento);
  }
}