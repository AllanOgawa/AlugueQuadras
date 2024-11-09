import { InjectRepository } from "@nestjs/typeorm";
import { ILike, In, Repository } from "typeorm";
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";

import { Estabelecimento } from "./entities/estabelecimento.entity";
import { CreateEstabelecimentoDto } from "./dto/create-estabelecimento.dto";
import { UpdateEstabelecimentoDto } from "./dto/update-estabelecimento.dto";
import { Usuario } from "@src/domains/auth/usuario/entities/usuario.entity";
import { ImagemService } from "@src/domains/storage/imagem/imagem.service";
import { EnderecoService } from "@src/domains/geral/endereco/endereco.service";
import { Quadra } from "./quadra/entities/quadra.entity";
import { SearchEstabelecimentoDto } from "./dto/search.dto";
import { AcomodacaoService } from './acomodacao/acomodacao.service';
import { HorarioFuncionamentoService } from "./horario-funcionamento/horario-funcionamento.service";

@Injectable()
export class EstabelecimentoService {
  constructor(
    @InjectRepository(Estabelecimento)
    private readonly estabelecimentoRepository: Repository<Estabelecimento>,
    private imagemService: ImagemService,
    private enderecoService: EnderecoService,
    private acomodacaoService: AcomodacaoService,
    private horarioFuncionamentoService: HorarioFuncionamentoService,
  ) { }

  async create(
    createEstabelecimentoDto: CreateEstabelecimentoDto,
    usuario: Usuario,
  ): Promise<Estabelecimento> {
    let estabelecimento: Estabelecimento;
    let novasImagens = [];
    let acomodacoes = [];

    if (createEstabelecimentoDto.acomodacoesToAdd && createEstabelecimentoDto.acomodacoesToAdd.length > 0) {
      acomodacoes = await this.acomodacaoService.findByIdkeys(createEstabelecimentoDto.acomodacoesToAdd);
    }

    try {
      estabelecimento = this.estabelecimentoRepository.create({
        ...createEstabelecimentoDto,
        acomodacoes,
        usuario,
      });

      estabelecimento =
        await this.estabelecimentoRepository.save(estabelecimento);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao criar estabelecimento (E-mail ou CNPJ já cadastrado)',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (
      createEstabelecimentoDto.imagensToAdd &&
      createEstabelecimentoDto.imagensToAdd.length > 0
    ) {
      try {
        novasImagens = await this.imagemService.createImagens(
          createEstabelecimentoDto.imagensToAdd,
        );

        await this.estabelecimentoRepository
          .createQueryBuilder()
          .relation(Estabelecimento, 'imagens')
          .of(estabelecimento)
          .add(novasImagens);
      } catch (error) {
        console.log(error);
        throw new BadRequestException(
          'Erro ao associar imagens ao estabelecimento.',
        );
      }
    }

    return this.findByIdkey(estabelecimento.idkey);
  }

  async searchByCriteria(query: SearchEstabelecimentoDto): Promise<{
    data: Estabelecimento[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { idkey, page = 1, limit = 10, ...filters } = query;
    const whereConditions: any = {};

    const allowedFields = ['nome', 'rating']; // Campos permitidos para busca

    if (idkey !== undefined) {
      whereConditions.idkey = idkey;
    }

    for (const [key, value] of Object.entries(filters)) {
      if (allowedFields.includes(key)) {
        whereConditions[key] = ILike(`%${value}%`);
      }
    }

    const [data, total] = await this.estabelecimentoRepository.findAndCount({
      where: whereConditions,
      skip: (page - 1) * limit,
      take: limit,
    });

    if (!data || data.length === 0) {
      throw new NotFoundException(
        'Nenhum estabelecimento encontrado com os critérios fornecidos',
      );
    }

    return { data, total, page, limit };
  }

  async findQuadrasByIdkeyEstabelecimento(idkey: number): Promise<Quadra[]> {
    const estabelecimento = await this.estabelecimentoRepository.findOne({
      where: { idkey },
      relations: ['quadras'],
    });

    if (!estabelecimento) {
      throw new NotFoundException(
        `Estabelecimento com idkey ${idkey} não encontrado`,
      );
    }

    const quadras = estabelecimento.quadras;

    if (!quadras || quadras.length === 0) {
      throw new NotFoundException(
        `Nenhuma quadra encontrada para o estabelecimento com idkey ${idkey}`,
      );
    }

    return quadras;
  }

  async findAll(): Promise<Estabelecimento[]> {
    try {
      return await this.estabelecimentoRepository.find();
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar estabelecimentos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllByUser(usuario: Usuario): Promise<Estabelecimento[]> {
    try {
      return await this.estabelecimentoRepository.find({
        where: { usuario: { idkey: usuario.idkey } },
      });
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar estabelecimentos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByIdkey(idkey: number): Promise<Estabelecimento> {
    try {
      return await this.estabelecimentoRepository.findOne({
        where: { idkey },
      });
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar estabelecimento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async findByIdkeyAndUser(idkey: number, usuario: Usuario): Promise<Estabelecimento> {
    try {
      return await this.estabelecimentoRepository.findOne({
        where: { idkey, usuario: { idkey: usuario.idkey } }
      });
    } catch (error) {
      throw new HttpException('Erro ao buscar estabelecimento', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
  async updateFields(idkey: number, updateEstabelecimentoDto: UpdateEstabelecimentoDto): Promise<void> {
    const { nome, telefone, email, alvara, sobre } = updateEstabelecimentoDto;
    
    const updateData: Partial<Estabelecimento> = {};
    if (nome) updateData.nome = nome;
    if (telefone) updateData.telefone = telefone;
    if (email) updateData.email = email;
    if (alvara) updateData.alvara = alvara;
    if (sobre) updateData.sobre = sobre;

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

  async manageImages(
    estabelecimento: Estabelecimento,
    imagensToAdd?: string[],
    imagensToRemove?: string[],
  ): Promise<void> {
    if (imagensToAdd && imagensToAdd.length > 0) {
      try {
        const imagensExistentes = estabelecimento.imagens.map(
          (imagem) => imagem.path,
        );
        const novasImagensParaAdicionar = imagensToAdd.filter(
          (caminho) => !imagensExistentes.includes(caminho),
        );

        if (novasImagensParaAdicionar.length > 0) {
          const imagensEntities = await this.imagemService.createImagens(
            novasImagensParaAdicionar,
          );
          await this.estabelecimentoRepository
            .createQueryBuilder()
            .relation(Estabelecimento, 'imagens')
            .of(estabelecimento)
            .add(imagensEntities);
        }
      } catch (error) {
        console.log(error);
        throw new BadRequestException(
          'Erro ao adicionar imagens ao estabelecimento.',
        );
      }
    }

    if (imagensToRemove && imagensToRemove.length > 0) {
      try {
        const imagensParaRemover =
          await this.imagemService.searchPathsImagens(imagensToRemove);
        await this.estabelecimentoRepository
          .createQueryBuilder()
          .relation(Estabelecimento, 'imagens')
          .of(estabelecimento)
          .remove(imagensParaRemover);

        await this.imagemService.removeImagens(imagensToRemove);
      } catch (error) {
        console.log(error);
        throw new BadRequestException(
          'Erro ao remover imagens do estabelecimento.',
        );
      }
    }
  }

  async update(
    idkey: number,
    updateEstabelecimentoDto: UpdateEstabelecimentoDto,
  ): Promise<Estabelecimento> {
    await this.updateFields(idkey, updateEstabelecimentoDto);

    const estabelecimento = await this.findByIdkey(idkey);
    const { imagensToAdd, imagensToRemove, horariosFuncionamento, acomodacoesToAdd, acomodacoesToRemove } = updateEstabelecimentoDto;

    await this.manageImages(estabelecimento, imagensToAdd, imagensToRemove);
    await this.manageAcomodacoes(estabelecimento, acomodacoesToAdd, acomodacoesToRemove);

    if (updateEstabelecimentoDto.endereco) {
      await this.enderecoService.update(
        estabelecimento.endereco.idkey,
        updateEstabelecimentoDto.endereco,
      );
    }

    if (horariosFuncionamento && horariosFuncionamento.length > 0) {
      await this.horarioFuncionamentoService.syncHorariosFuncionamento(estabelecimento, horariosFuncionamento);
    }

    return this.findByIdkey(idkey);
  }

  async remove(idkey: number, usuario: Usuario): Promise<void> {
    const estabelecimento = await this.findByIdkeyAndUser(idkey, usuario);

    // Remove as imagens associadas
    if (estabelecimento.imagens && estabelecimento.imagens.length > 0) {
      const caminhosImagens = estabelecimento.imagens.map(
        (imagem) => imagem.path,
      );
      await this.imagemService.removeImagens(caminhosImagens);
    }

    if (estabelecimento.horariosFuncionamento && estabelecimento.horariosFuncionamento.length > 0) {
      await this.horarioFuncionamentoService.removeBatch(estabelecimento.horariosFuncionamento.map(horario => horario.idkey));
    }

    //remover as quadras

    try {
      await this.estabelecimentoRepository.remove(estabelecimento);

      if (estabelecimento.endereco) {
        await this.enderecoService.remove(estabelecimento.endereco.idkey);
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Erro ao remover estabelecimento.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async manageAcomodacoes(estabelecimento: Estabelecimento, acomodacoesToAdd?: number[], acomodacoesToRemove?: number[]): Promise<Estabelecimento> {
    if (acomodacoesToAdd && acomodacoesToAdd.length > 0) {
      try {
        const acomodacoesEntities = await this.acomodacaoService.findByIdkeys(acomodacoesToAdd);

        // Obter os IDs das acomodações já associadas
        const existingAcomodacaoIds = estabelecimento.acomodacoes.map(a => a.idkey);

        // Filtrar para evitar duplicações
        const novasAcomodacoes = acomodacoesEntities.filter(a => !existingAcomodacaoIds.includes(a.idkey));

        if (novasAcomodacoes.length > 0) {
          await this.estabelecimentoRepository
            .createQueryBuilder()
            .relation(Estabelecimento, 'acomodacoes')
            .of(estabelecimento)
            .add(novasAcomodacoes);
        }
      } catch (error) {
        if (error instanceof HttpException) {
          throw error;
        }
        throw new BadRequestException('Erro ao adicionar acomodações ao estabelecimento.');
      }
    }

    if (acomodacoesToRemove && acomodacoesToRemove.length > 0) {
      try {
        const acomodacoesEntities = await this.acomodacaoService.findByIdkeys(acomodacoesToRemove);

        await this.estabelecimentoRepository
          .createQueryBuilder()
          .relation(Estabelecimento, 'acomodacoes')
          .of(estabelecimento)
          .remove(acomodacoesEntities);
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Erro ao remover acomodações do estabelecimento.');
      }
    }

    return estabelecimento;
  }

}
