import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Usuario }          from './entities/usuario.entity';
import { ImagemService }    from '@src/domains/storage/imagem/imagem.service';

import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly imagemService: ImagemService,
  ) {}

  async findByIdkey(idkey: number): Promise<Usuario> {
    return await this.usuarioRepository.findOne({ 
      where: { idkey }
    });
  }

  async findByEmail(email: string): Promise<Usuario> {
    try{
      return await this.usuarioRepository.findOne({ 
        where: { email }
      });
    } catch (error) { 
      console.log(error);
      throw new BadRequestException('Erro ao buscar usuário por email.');
    }
  }

  async findByUsername(username: string): Promise<Usuario> {
    try{
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

  async update(idkey: number, updateProfileDto: UpdateProfileDto): Promise<Usuario> {
    const { nome, imagensToAdd, imagensToRemove } = updateProfileDto;
    const usuario                                 = await this.findByIdkey(idkey);

    if (nome) {
      usuario.nome = nome;
      await this.usuarioRepository.save(usuario);
    };

    if (imagensToAdd && imagensToAdd.length > 0) {
        try {
          const imagensEntities = await this.imagemService.createImagens(imagensToAdd);

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
      try{
        const imagensParaRemover = await this.imagemService.searchPathsImagens(imagensToRemove);
        await this.usuarioRepository
          .createQueryBuilder()
          .relation(Usuario, 'imagens')
          .of(usuario)
          .remove(imagensParaRemover);

        await this.imagemService.removeImagens(imagensToRemove);
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
