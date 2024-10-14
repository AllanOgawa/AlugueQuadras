import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from './entities/usuario.entity';
import { Imagem } from '@domains/storage/entities/imagem.entity';

import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    
    @InjectRepository(Imagem)
    private readonly imagemRepository: Repository<Imagem>, 
  ) {}


  async findByIdkey(idkey: number): Promise<Usuario> {
    return await this.usuarioRepository.findOne({ 
      where: { idkey },
      relations: ['tipo']
    });
  }

  async findByEmail(email: string): Promise<Usuario> {
    return await this.usuarioRepository.findOne({ 
      where: { email },
      relations: ['tipo']
    });
  }

  async findByUsername(username: string): Promise<Usuario> {
    return await this.usuarioRepository.findOne({
      where: { username },
      relations: ['tipo'] 
    });
  }

  async create(createProfileDto: CreateProfileDto): Promise<any> {
    let novoUsuario: Usuario;
    let imagensSalvas: Imagem[] = [];

    if (createProfileDto.imagensToAdd && createProfileDto.imagensToAdd.length > 0) {

      // Criar novas imagens para os paths que não existem
      const novasImagens = this.imagemRepository.create(
        createProfileDto.imagensToAdd.map((path) => ({ path })),
      );

      try {
        imagensSalvas = await this.imagemRepository.save(novasImagens);
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Erro ao salvar imagens do usuário.');
      }
    }

    try {
      novoUsuario = await this.usuarioRepository.save(createProfileDto);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Erro ao criar usuário (UNIQUE KEY).');
    }

    // Associar as imagens ao usuário utilizando QueryBuilder
    if (imagensSalvas.length > 0) {
      try {
        await this.usuarioRepository
          .createQueryBuilder()
          .relation(Usuario, 'imagens')
          .of(novoUsuario)
          .add(imagensSalvas);
      } catch (error) {
        console.log(error);
        throw new BadRequestException('Erro ao associar imagens ao usuário.');
      }
    }

    return novoUsuario;
  }

  async update(idkey: number, updateProfileDto: UpdateProfileDto): Promise<Usuario> {
    const { nome, imagensToAdd, imagensToRemove } = updateProfileDto;
    const usuario                                 = await this.findByIdkey(idkey);

    if (nome) {
      usuario.nome = nome;
      await this.usuarioRepository.save(usuario);
    };

    if (imagensToAdd && imagensToAdd.length > 0) {
        // Buscar imagens existentes com os paths fornecidos
        const imagensExistentes = await this.imagemRepository.find({
          where: { path: In(imagensToAdd) },
        });

        // Encontrar quais imagens precisam ser criadas
        const imagensParaCriarPaths = imagensToAdd.filter(
          path => !imagensExistentes.some(imagem => imagem.path === path)
        );

        // Criar novas imagens para os paths que não existem
        const novasImagens = this.imagemRepository.create(
          imagensParaCriarPaths.map(path => ({ path }))
        );

        const imagensSalvas = await this.imagemRepository.save(novasImagens);

        const imagensEntities = [...imagensExistentes, ...imagensSalvas];
        
        try {
          await this.usuarioRepository
          .createQueryBuilder()
          .relation(Usuario, 'imagens')
          .of(usuario)
          .add(imagensEntities);
        } catch (error) {
          console.log(error);
          throw new BadRequestException('Erro ao atualizar imagens do usuário.');
        }
    }
    
    if (imagensToRemove && imagensToRemove.length > 0) {
      // Buscar imagens existentes com os paths fornecidos para remoção
      const imagensParaRemover = await this.imagemRepository.find({
        where: { path: In(imagensToRemove) },
      });

      if (imagensParaRemover.length === 0) {
        throw new BadRequestException('Nenhuma imagem encontrada para remoção.');
      }

      try{
        await this.usuarioRepository
          .createQueryBuilder()
          .relation(Usuario, 'imagens')
          .of(usuario)
          .remove(imagensParaRemover);
        await this.imagemRepository.remove(imagensParaRemover);
      } catch (error) { 
        console.log(error);
        throw new BadRequestException('Erro ao remover imagens do usuário.');
      }
    }

    return this.findByIdkey(idkey);
  }
  
  async updatePassword(idkey: number, senhaNovaHashed: string): Promise<void> {
    await this.usuarioRepository.update(idkey, { senha: senhaNovaHashed });
  }

  async remove(idkey: number): Promise<void> {
    await this.usuarioRepository.delete(idkey);
  }

}
