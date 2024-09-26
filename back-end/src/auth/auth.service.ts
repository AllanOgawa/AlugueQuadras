import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsuarioService } from '../admin/usuario/usuario.service';
import { MudarSenhaDto } from './dto/mudar-senha';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async register(usuario: any) {
    const hashedPassword = await bcrypt.hash(usuario.senha, 10);

    const novoUsuario = await this.usuarioService.create({
      ...usuario,
      senha: hashedPassword,
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
      username: usuario.username,
      email: usuario.email, 
      sub: usuario.idkey,
      tipo: usuario.tipo.descricao 
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }


  async changePassword(idkey: number, mudarSenhaDTO: MudarSenhaDto): Promise<void> {
    const { senhaAtual, senhaNova } = mudarSenhaDTO;

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

}
