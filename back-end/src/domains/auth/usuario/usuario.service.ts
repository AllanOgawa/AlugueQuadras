import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Usuario } from './entities/usuario.entity';
import { ImagemService } from '@src/domains/storage/imagem/imagem.service';

import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly imagemService: ImagemService,
  ) { }

  async findByIdkey(idkey: number): Promise<Usuario> {
    return await this.usuarioRepository.findOne({
      where: { idkey }
    });
  }

  async findByEmail(email: string): Promise<Usuario> {
    try {
      return await this.usuarioRepository.findOne({
        where: { email }
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Erro ao buscar usuário por email.');
    }
  }

  async findByUsername(username: string): Promise<Usuario> {
    try {
      return await this.usuarioRepository.findOne({
        where: { username }
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Erro ao buscar usuário por username.');
    }
  }

  async create(createProfileDto: CreateProfileDto): Promise<any> {
    let novoUsuario: Usuario;
    let novasImagens = [];

    try {
      novoUsuario = await this.usuarioRepository.save(createProfileDto);
      novoUsuario.senha = '********';
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Erro ao criar usuário (UNIQUE KEY).');
    }

    if (createProfileDto.imagensToAdd && createProfileDto.imagensToAdd.length > 0) {
      novasImagens = await this.imagemService.createImagens(createProfileDto.imagensToAdd);
    }

    if (novasImagens.length > 0) {
      try {
        await this.usuarioRepository
          .createQueryBuilder()
          .relation(Usuario, 'imagens')
          .of(novoUsuario)
          .add(novasImagens);
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Erro ao associar imagens ao usuário.');
      }
    }

    return novoUsuario;
  }

  async manageImages(usuario: Usuario, imagensToAdd?: string[], imagensToRemove?: string[]): Promise<void> {

    if (imagensToAdd && imagensToAdd.length > 0) {
      try {
        const imagensExistentes = usuario.imagens.map(imagem => imagem.path);
        const novasImagensParaAdicionar = imagensToAdd.filter(caminho => !imagensExistentes.includes(caminho));

        if (novasImagensParaAdicionar.length > 0) {
          const imagensEntities = await this.imagemService.createImagens(novasImagensParaAdicionar);
          await this.usuarioRepository
            .createQueryBuilder()
            .relation(Usuario, 'imagens')
            .of(usuario)
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
        await this.usuarioRepository
          .createQueryBuilder()
          .relation(Usuario, 'imagens')
          .of(usuario)
          .remove(imagensParaRemover);

        await this.imagemService.removeImagens(imagensToRemove);
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Erro ao remover imagens do estabelecimento.');
      }
    }
  }

  async updateFields(idkey: number, updateProfileDto: UpdateProfileDto): Promise<void> {
    const { nome, username } = updateProfileDto;
  
    const updateData: Partial<Usuario> = {};
    if (nome) updateData.nome = nome;
  
    if (username) {
      const usuario = await this.findByUsername(username);
      if (usuario) {
        throw new HttpException(
          'Erro ao atualizar usuario (username já existe).',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      updateData.username = username;
    }
  
    if (updateData.username || updateData.nome) {
      try {
        await this.usuarioRepository.update(idkey, updateData);
      } catch (error) {
        console.log(error);
        throw new HttpException(
          'Erro ao atualizar usuario.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  

  async update(idkey: number, updateProfileDto: UpdateProfileDto): Promise<Usuario> {

    await this.updateFields(idkey, updateProfileDto);

    const usuario = await this.findByIdkey(idkey);

    const { imagensToAdd, imagensToRemove } = updateProfileDto;
    await this.manageImages(usuario, imagensToAdd, imagensToRemove);

    return this.findByIdkey(idkey);
  }

  async updatePassword(idkey: number, senhaNovaHashed: string): Promise<void> {
    await this.usuarioRepository.update(idkey, { senha: senhaNovaHashed });
  }

  async remove(idkey: number): Promise<void> {
    await this.usuarioRepository.delete(idkey);
  }

}
