import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsuarioService } from './usuario/usuario.service';
import { UsuarioTipoService } from './usuario/tipo/tipo.service';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { GetProfileDto } from './dto/get-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioTipoService: UsuarioTipoService,
    private readonly usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async register(usuario: any) {
    const { tipo, senhaSemHash, data_nascimento, ...userData } = usuario;

    const tipoUsuario     = await this.usuarioTipoService.findByIdkey(tipo);
    const hashedPassword  = await bcrypt.hash(usuario.senha, 10);

    const novoUsuario = await this.usuarioService.create({
      ...userData,
      tipo: tipoUsuario,
      senha: hashedPassword,
      data_nascimento: new Date(data_nascimento)
    });

    const { senha, ...result } = novoUsuario;
    return result;
  }

  async validateUser(login: string, senha: string): Promise<any> {
    let usuario;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(login);

    if(isEmail){
      usuario = await this.usuarioService.findByEmail(login);
    }else{
      usuario = await this.usuarioService.findByUsername(login);
    }

    if(usuario && await bcrypt.compare(senha, usuario.senha)){
      const { senha, ...result } = usuario;
      return result;
    }
    return null;
  }

  // Gera um token JWT para o usuário autenticado
  async login(usuario: any) {
    const payload = { 
      idkey: usuario.idkey,
      username: usuario.username,
      email: usuario.email,
      tipo: usuario.tipo.descricao 
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }


  async changePassword(idkey: number, changePasswordDTO: ChangePasswordDTO): Promise<void> {
    const { senhaAtual, senhaNova } = changePasswordDTO;

    const usuario = await this.usuarioService.findByIdkey(idkey);
    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaCorreta) {
      throw new UnauthorizedException('A senha atual está incorreta.');
    }

    const senhaIgual = await bcrypt.compare(senhaNova, usuario.senha);
    if (senhaIgual) {
      throw new BadRequestException('A nova senha deve ser diferente da senha atual.');
    }

    const senhaNovaHashed = await bcrypt.hash(senhaNova, 10);
    await this.usuarioService.updatePassword(idkey, senhaNovaHashed);
  }

  async getProfile(idkey: number): Promise<any>{
    const usuario = await this.usuarioService.findByIdkey(idkey);

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const perfil: GetProfileDto = {
      idkey: usuario.idkey,
      nome: usuario.nome,
      username: usuario.username,
      email: usuario.email,
      cpf: usuario.cpf,
      data_nascimento: usuario.data_nascimento,
      data_cadastro: usuario.data_cadastro,
      tipo: {
        idkey: usuario.tipo.idkey,
        descricao: usuario.tipo.descricao,
      },
      imagem: usuario.imagem ? usuario.imagem.toString('base64') : null, 
    };

    return perfil;
  }

  async updateProfile(idkey: number, updateProfileDto: UpdateProfileDto): Promise<GetProfileDto> {
    const { nome, imagem } = updateProfileDto;

    const usuario = await this.usuarioService.findByIdkey(idkey);
    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    if (nome) {
      usuario.nome = nome;
    }

    if (imagem) {
      const bufferImagem = Buffer.from(imagem, 'base64');
      usuario.imagem = bufferImagem;
    }

    const usuarioAtualizado = await this.usuarioService.update(idkey, usuario);
    const perfilAtualizado  = await this.getProfile(idkey);

    return perfilAtualizado;
  }
}
