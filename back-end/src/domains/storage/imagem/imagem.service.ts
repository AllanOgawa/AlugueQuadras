import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Imagem } from './entities/imagem.entity';

@Injectable()
export class ImagemService {
  constructor(
    @InjectRepository(Imagem)
    private readonly imagemRepository: Repository<Imagem>,
  ) { }

  async createImagem(path: string): Promise<Imagem> {
    const novaImagem = this.imagemRepository.create({ path });

    try {
      return await this.imagemRepository.save(novaImagem);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Erro ao salvar a imagem.');
    }
  }

  async createImagens(paths: string[]): Promise<Imagem[]> {
    try {
      // Buscar imagens existentes com os paths fornecidos
      const imagensExistentes = await this.searchPathsImagens(paths);

      // Encontrar quais imagens precisam ser criadas
      const pathsInexistentes = await this.filterPathsInexistentes(paths);

      // Criar novas imagens para os paths que não existem
      const novasImagens = this.imagemRepository.create(
        pathsInexistentes.map((path) => ({ path })),
      );

      let imagensSalvas: Imagem[] = [];
      if (novasImagens.length > 0) {
        try {
          imagensSalvas = await this.imagemRepository.save(novasImagens);
        } catch (error) {
          console.error(error);
          throw new BadRequestException('Erro ao salvar novas imagens.');
        }
      }

      return [...imagensExistentes, ...imagensSalvas];
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Erro ao adicionar imagens.');
    }
  }

  async imagemExiste(path: string): Promise<boolean> {
    try {
      const count = await this.imagemRepository.count({ where: { path } });
      return count > 0;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Erro ao verificar se a imagem existe.');
    }
  }

  async searchPathsImagens(paths: string[]): Promise<Imagem[]> {
    try {
      return await this.imagemRepository.find({
        where: { path: In(paths) },
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Erro ao buscar imagens pelos paths.');
    }
  }

  async filterPathsInexistentes(paths: string[]): Promise<string[]> {
    try {
      const imagensExistentes = await this.searchPathsImagens(paths);
      const pathsExistentes = imagensExistentes.map((imagem) => imagem.path);

      return paths.filter((path) => !pathsExistentes.includes(path));
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Erro ao filtrar paths inexistentes.');
    }
  }

  async removeImagem(path: string): Promise<void> {
    try {
      const resultado = await this.imagemRepository.delete({ path });

      if (resultado.affected === 0) {
        throw new NotFoundException('Imagem não encontrada.');
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Erro ao remover a imagem.');
    }
  }

  async removeImagens(paths: string[]): Promise<void> {
    try {
      await this.searchPathsImagens(paths);

      const resultado = await this.imagemRepository.delete({ path: In(paths) });

      if (resultado.affected === 0) {
        throw new NotFoundException('Nenhuma imagem encontrada para exclusão.');
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Erro ao remover as imagens.');
    }
  }

}
