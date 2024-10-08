import { InjectRepository } from "@nestjs/typeorm";
import { Estabelecimento } from "./entities/estabelecimento.entity";
import { Repository } from "typeorm";
import { CreateEstabelecimentoDto } from "./dto/create-estabelecimento.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Usuario } from "@src/auth/usuario/entities/usuario.entity";

@Injectable()
export class EstabelecimentoService{
  constructor(
    @InjectRepository(Estabelecimento)
    private readonly estabelecimentoRepository: Repository<Estabelecimento>,
  ){}

  async create(createEstabelecimentoDto: CreateEstabelecimentoDto, usuario: Usuario): Promise<Estabelecimento>{
    const estabelecimento = await this.estabelecimentoRepository.create({...createEstabelecimentoDto, usuario});
    return await this.estabelecimentoRepository.save(estabelecimento);
  }

  async findAll(): Promise<Estabelecimento[]>{
    return await this.estabelecimentoRepository.find({
      relations: ['quadras']
    });
  }

  async findAllByUser(usuario: Usuario): Promise<Estabelecimento[]>{
    return await this.estabelecimentoRepository.find({
      where: { usuario },
      relations: ['quadras']
    });
  }

  async findByIdkey(idkey: number): Promise<Estabelecimento>{
    return await this.estabelecimentoRepository.findOne({
      where:{ idkey },
      relations: ['quadras']
    });
  }

  async update(idkey: number, updateData: Partial<Estabelecimento>): Promise<Estabelecimento>{
    await this.estabelecimentoRepository.update(idkey, updateData);
    return this.findByIdkey(idkey);
  }

  async remove(idkey: number): Promise<void>{
    const estabelecimento = await this.findByIdkey(idkey);
    await this.estabelecimentoRepository.remove(estabelecimento);
  }
}