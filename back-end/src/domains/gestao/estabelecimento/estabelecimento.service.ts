import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { Estabelecimento }          from "./entities/estabelecimento.entity";
import { CreateEstabelecimentoDto } from "./dto/create-estabelecimento.dto";
import { UpdateEstabelecimentoDto } from "./dto/update-estabelecimento.dto";
import { Usuario }                  from "@domains/auth/usuario/entities/usuario.entity";
import { UsuarioService }           from "@domains/auth/usuario/usuario.service";

@Injectable()
export class EstabelecimentoService{
  constructor(
    @InjectRepository(Estabelecimento)
    private readonly estabelecimentoRepository: Repository<Estabelecimento>,
    private readonly usuarioService: UsuarioService,
  ){}

  async create(createEstabelecimentoDto: CreateEstabelecimentoDto, usuario: Usuario): Promise<Estabelecimento>{
    try{
      const estabelecimento         = await this.estabelecimentoRepository.create({...createEstabelecimentoDto, usuario});
      const createdEstabelecimento  = await this.estabelecimentoRepository.save(estabelecimento);

      // const tipoUsuarioNew = await this.usuarioTipoService.findByIdkey(2);
      // await this.usuarioService.update(usuario.idkey, 
      //   { tipo :  tipoUsuarioNew  });

      return createdEstabelecimento;
    }catch(error){
      throw new HttpException('Erro ao criar estabelecimento (email ou cnpj já cadastrado)', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<Estabelecimento[]>{
    try{
      return await this.estabelecimentoRepository.find();
    }catch(error){
      throw new HttpException('Erro ao buscar estabelecimentos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAllByUser(usuario: Usuario): Promise<Estabelecimento[]>{
    try{
      return await this.estabelecimentoRepository.find({
        where: { usuario : { idkey: usuario.idkey } },
      });
    }
    catch(error){
      throw new HttpException('Erro ao buscar estabelecimentos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByIdkey(idkey: number): Promise<Estabelecimento>{
    try{
      return await this.estabelecimentoRepository.findOne({
        where:{ idkey },
        relations: ['quadras']
      });
    } catch (error) {
      throw new HttpException('Erro ao buscar estabelecimento', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(idkey: number, updateEstabelecimentoDto: UpdateEstabelecimentoDto): Promise<Estabelecimento>{
    try{
      await this.estabelecimentoRepository.update(idkey, updateEstabelecimentoDto);
      return this.findByIdkey(idkey);
    }catch(error){
      throw new HttpException('Erro ao atualizar estabelecimento', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(idkey: number, usuario: Usuario): Promise<void>{
    const estabelecimento = await this.findByIdkey(idkey);

    // const tipoUsuarioNew = await this.usuarioTipoService.findByIdkey(1);
    // await this.usuarioService.update(usuario.idkey, 
    //   { tipo :  tipoUsuarioNew  });

    await this.estabelecimentoRepository.remove(estabelecimento);
  }
}