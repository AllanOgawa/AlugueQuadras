import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { Estabelecimento }          from "./entities/estabelecimento.entity";
import { CreateEstabelecimentoDto } from "./dto/create-estabelecimento.dto";
import { UpdateEstabelecimentoDto } from "./dto/update-estabelecimento.dto";
import { Usuario }                  from "@src/domains/auth/usuario/entities/usuario.entity";
import { ImagemService }            from "@src/domains/storage/imagem/imagem.service";

@Injectable()
export class EstabelecimentoService{
  constructor(
    @InjectRepository(Estabelecimento)
    private readonly estabelecimentoRepository: Repository<Estabelecimento>,
    private imagemService: ImagemService,
  ){}

  async create(createEstabelecimentoDto: CreateEstabelecimentoDto, usuario: Usuario): Promise<Estabelecimento> {
    let estabelecimento: Estabelecimento;
    let novasImagens = [];

    try {
      estabelecimento = this.estabelecimentoRepository.create({ ...createEstabelecimentoDto, usuario });
      estabelecimento = await this.estabelecimentoRepository.save(estabelecimento);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao criar estabelecimento (E-mail ou CNPJ já cadastrado)',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (createEstabelecimentoDto.imagensToAdd && createEstabelecimentoDto.imagensToAdd.length > 0) {
      try {
        novasImagens = await this.imagemService.createImagens(createEstabelecimentoDto.imagensToAdd);

        await this.estabelecimentoRepository
          .createQueryBuilder()
          .relation(Estabelecimento, 'imagens')
          .of(estabelecimento)
          .add(novasImagens);
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Erro ao associar imagens ao estabelecimento.');
      }
    }

    return this.findByIdkey(estabelecimento.idkey);
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

  async updateFields(idkey: number, updateEstabelecimentoDto: UpdateEstabelecimentoDto): Promise<void> {
    const { nome, telefone, email, alvara } = updateEstabelecimentoDto;

    const updateData: Partial<Estabelecimento> = {};
    if (nome)     updateData.nome = nome;
    if (telefone) updateData.telefone = telefone;
    if (email)    updateData.email = email;
    if (alvara)   updateData.alvara = alvara;

    try {
      await this.estabelecimentoRepository.update(idkey, updateData);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao atualizar estabelecimento (possível duplicação de email ou CNPJ).',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async manageImages(estabelecimento: Estabelecimento, imagensToAdd?: string[], imagensToRemove?: string[]): Promise<void> {
  
    if (imagensToAdd && imagensToAdd.length > 0) {
      try {
        const imagensExistentes = estabelecimento.imagens.map(imagem => imagem.path);
        const novasImagensParaAdicionar = imagensToAdd.filter(caminho => !imagensExistentes.includes(caminho));

        if (novasImagensParaAdicionar.length > 0) {
          const imagensEntities = await this.imagemService.createImagens(novasImagensParaAdicionar);
          await this.estabelecimentoRepository
            .createQueryBuilder()
            .relation(Estabelecimento, 'imagens')
            .of(estabelecimento)
            .add(imagensEntities);
        }
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Erro ao adicionar imagens ao estabelecimento.');
      }
    }

    if (imagensToRemove && imagensToRemove.length > 0) {
      try {
        const imagensParaRemover = await this.imagemService.searchPathsImagens(imagensToRemove);
        await this.estabelecimentoRepository
          .createQueryBuilder()
          .relation(Estabelecimento, 'imagens')
          .of(estabelecimento)
          .remove(imagensParaRemover);

        await this.imagemService.removeImagens(imagensToRemove);
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Erro ao remover imagens do estabelecimento.');
      }
    }
  }

  async update(idkey: number, updateEstabelecimentoDto: UpdateEstabelecimentoDto): Promise<Estabelecimento> {
    await this.updateFields(idkey, updateEstabelecimentoDto);

    const estabelecimento = await this.findByIdkey(idkey);

    const { imagensToAdd, imagensToRemove } = updateEstabelecimentoDto;
    await this.manageImages(estabelecimento, imagensToAdd, imagensToRemove);

    return this.findByIdkey(idkey);
  }

  async remove(idkey: number, usuario: Usuario): Promise<void>{
    const estabelecimento = await this.findByIdkey(idkey);

    // const tipoUsuarioNew = await this.usuarioTipoService.findByIdkey(1);
    // await this.usuarioService.update(usuario.idkey, 
    //   { tipo :  tipoUsuarioNew  });

    await this.estabelecimentoRepository.remove(estabelecimento);
  }
}