import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';

import { Estabelecimento } from './entities/estabelecimento.entity';
import { CreateEstabelecimentoDto } from './dto/create-estabelecimento.dto';
import { UpdateEstabelecimentoDto } from './dto/update-estabelecimento.dto';
import { Usuario } from '@src/domains/auth/usuario/entities/usuario.entity';
import { ImagemService } from '@src/domains/storage/imagem/imagem.service';
import { EnderecoService } from '@src/domains/geral/endereco/endereco.service';
import { AcomodacaoService } from './acomodacao/acomodacao.service';

@Injectable()
export class EstabelecimentoService {
    constructor(
        @InjectRepository(Estabelecimento)
        private readonly estabelecimentoRepository: Repository<Estabelecimento>,
        private imagemService: ImagemService,
        private enderecoService: EnderecoService,
        private acomodacaoService: AcomodacaoService,
    ) {}

    async create(
        createEstabelecimentoDto: CreateEstabelecimentoDto,
        usuario: Usuario,
    ): Promise<Estabelecimento> {
        let estabelecimento: Estabelecimento;
        let novasImagens = [];
        let novasAcomodacoes = [];

        try {
            estabelecimento = this.estabelecimentoRepository.create({
                ...createEstabelecimentoDto,
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

        if (
            createEstabelecimentoDto.acomodacoesToAdd &&
            createEstabelecimentoDto.acomodacoesToAdd.length > 0
        ) {
            try {
                novasAcomodacoes =
                    await this.acomodacaoService.createAcomodacoes(
                        createEstabelecimentoDto.acomodacoesToAdd,
                    );
                await this.estabelecimentoRepository
                    .createQueryBuilder()
                    .relation(Estabelecimento, 'acomodacoes')
                    .of(estabelecimento)
                    .add(novasAcomodacoes);
            } catch (error) {
                console.log(error);
                throw new BadRequestException(
                    'Erro ao associar acomodações ao estabelecimento.',
                );
            }
        }

        return this.findByIdkey(estabelecimento.idkey);
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

    async updateFields(
        idkey: number,
        updateEstabelecimentoDto: UpdateEstabelecimentoDto,
    ): Promise<void> {
        const { nome, telefone, email, alvara } = updateEstabelecimentoDto;

        const updateData: Partial<Estabelecimento> = {};
        if (nome) updateData.nome = nome;
        if (telefone) updateData.telefone = telefone;
        if (email) updateData.email = email;
        if (alvara) updateData.alvara = alvara;

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
                    const imagensEntities =
                        await this.imagemService.createImagens(
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
                    await this.imagemService.searchPathsImagens(
                        imagensToRemove,
                    );
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

        const {
            imagensToAdd,
            imagensToRemove,
            acomodacaoToAdd,
            acomodacoesToRemove,
        } = updateEstabelecimentoDto;
        await this.manageImages(estabelecimento, imagensToAdd, imagensToRemove);
        await this.manageAcomodacoes(
            estabelecimento,
            acomodacaoToAdd,
            acomodacoesToRemove,
        );

        if (updateEstabelecimentoDto.endereco) {
            await this.enderecoService.update(
                estabelecimento.endereco.idkey,
                updateEstabelecimentoDto.endereco,
            );
        }

        return this.findByIdkey(idkey);
    }

    async remove(idkey: number, usuario: Usuario): Promise<void> {
        const estabelecimento = await this.findByIdkey(idkey);

        if (estabelecimento.imagens && estabelecimento.imagens.length > 0) {
            const caminhosImagens = estabelecimento.imagens.map(
                (imagem) => imagem.path,
            );
            await this.imagemService.removeImagens(caminhosImagens);
        }

        if (
            estabelecimento.acomodacoes &&
            estabelecimento.acomodacoes.length > 0
        ) {
            const acomodacoesNomes = estabelecimento.acomodacoes.map(
                (acomodacao) => acomodacao.descricao,
            );
            await this.acomodacaoService.removeAcomodacoes(acomodacoesNomes);
        }

        try {
            await this.estabelecimentoRepository.remove(estabelecimento);
        } catch (error) {
            console.error(error);
            throw new HttpException(
                'Erro ao remover estabelecimento.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async manageAcomodacoes(
        estabelecimento: Estabelecimento,
        acomodacoesToAdd?: string[],
        acomodacoesToRemove?: string[],
    ): Promise<void> {
        if (acomodacoesToAdd && acomodacoesToAdd.length > 0) {
            try {
                const acomodacoesExistentes = estabelecimento.acomodacoes.map(
                    (acomodacao) => acomodacao.descricao,
                );
                const novasAcomodacoesParaAdicionar = acomodacoesToAdd.filter(
                    (descricao) => !acomodacoesExistentes.includes(descricao),
                );

                if (novasAcomodacoesParaAdicionar.length > 0) {
                    const acomodacoesEntities =
                        await this.acomodacaoService.createAcomodacoes(
                            novasAcomodacoesParaAdicionar,
                        );
                    await this.estabelecimentoRepository
                        .createQueryBuilder()
                        .relation(Estabelecimento, 'acomodacoes')
                        .of(estabelecimento)
                        .add(acomodacoesEntities);
                }
            } catch (error) {
                console.log(error);
                throw new BadRequestException(
                    'Erro ao adicionar acomodações ao estabelecimento.',
                );
            }
        }

        if (acomodacoesToRemove && acomodacoesToRemove.length > 0) {
            try {
                const acomodacoesParaRemover =
                    await this.acomodacaoService.searchAcomodacoes(
                        acomodacoesToRemove,
                    );
                await this.estabelecimentoRepository
                    .createQueryBuilder()
                    .relation(Estabelecimento, 'acomodacoes')
                    .of(estabelecimento)
                    .remove(acomodacoesParaRemover);

                await this.acomodacaoService.removeAcomodacoes(
                    acomodacoesToRemove,
                );
            } catch (error) {
                console.log(error);
                throw new BadRequestException(
                    'Erro ao remover acomodações do estabelecimento.',
                );
            }
        }
    }
}
