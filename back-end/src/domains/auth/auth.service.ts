import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsuarioService }     from './usuario/usuario.service';

import { ChangePasswordDTO }  from './dto/change-password.dto';
import { GetProfileDto }      from './dto/get-profile.dto';
import { UpdateProfileDto }   from './dto/update-profile.dto';
import { CreateProfileDto }   from './dto/create-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async register(createProfileDto: CreateProfileDto): Promise<any> {
    const { senha, ...usuario } = createProfileDto;
    
    const hashedPassword  = await bcrypt.hash(senha, 10);
    const novoUsuario = await this.usuarioService.create({
      ...usuario,
      senha: hashedPassword
    });

    return novoUsuario;
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
      idkey:    usuario.idkey,
      username: usuario.username,
      email:    usuario.email,
      tipo:     usuario.tipo
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
      dataNascimento: usuario.dataNascimento,
      dataCadastro: usuario.dataCadastro,
      tipo: usuario.tipo,
      imagens: usuario.imagens.map((imagem)=>({
        idkey: imagem.idkey,
        path: imagem.path,
        dataCadastro: imagem.dataCadastro,
      })), 
    };

    return perfil;
  }

  async updateProfile(idkey: number, updateProfileDto: UpdateProfileDto): Promise<any> {

    const usuario = await this.usuarioService.findByIdkey(idkey);
    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }

    const usuarioAtualizado = await this.usuarioService.update(idkey, updateProfileDto);

    return usuarioAtualizado;
  }
}
