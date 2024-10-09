import { InjectRepository } from "@nestjs/typeorm";
import { Estabelecimento } from "./entities/estabelecimento.entity";
import { Repository } from "typeorm";
import { CreateEstabelecimentoDto } from "./dto/create-estabelecimento.dto";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Usuario } from "@src/auth/usuario/entities/usuario.entity";
import { UsuarioService } from "@src/auth/usuario/usuario.service";
import { UsuarioTipoService } from "@src/auth/usuario/tipo/tipo.service";

@Injectable()
export class EstabelecimentoService{
  constructor(
    @InjectRepository(Estabelecimento)
    private readonly estabelecimentoRepository: Repository<Estabelecimento>,
    private readonly usuarioTipoService: UsuarioTipoService,
    private readonly usuarioService: UsuarioService,
  ){}

  async create(createEstabelecimentoDto: CreateEstabelecimentoDto, usuario: Usuario): Promise<Estabelecimento>{
    try{
      const estabelecimento         = await this.estabelecimentoRepository.create({...createEstabelecimentoDto, usuario});
      const createdEstabelecimento  = await this.estabelecimentoRepository.save(estabelecimento);

      const tipoUsuarioNew = await this.usuarioTipoService.findByIdkey(2);
      await this.usuarioService.update(usuario.idkey, 
        { tipo :  tipoUsuarioNew  });

      return createdEstabelecimento;
    }catch(error){
      throw new HttpException('Erro ao criar estabelecimento (email ou cnpj já cadastrado)', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<Estabelecimento[]>{
    return await this.estabelecimentoRepository.find();
  }

  async findAllByUser(usuario: Usuario): Promise<Estabelecimento[]>{
    return await this.estabelecimentoRepository.find({
      where: { usuario : { idkey: usuario.idkey } },
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

  async remove(idkey: number, usuario: Usuario): Promise<void>{
    const estabelecimento = await this.findByIdkey(idkey);

    const tipoUsuarioNew = await this.usuarioTipoService.findByIdkey(1);
    await this.usuarioService.update(usuario.idkey, 
      { tipo :  tipoUsuarioNew  });

    await this.estabelecimentoRepository.remove(estabelecimento);
  }
}