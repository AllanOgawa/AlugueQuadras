import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsuarioService } from '@/src/auth/usuario/usuario.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usuarioService: UsuarioService) {
    super({
      // Extrai o token JWT do cabeçalho Authorization como Bearer Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // tokens expirados sao rejeitados
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Evita que usuários excluídos ou desativados acessem o sistema com tokens antigos.
    const usuario = await this.usuarioService.findByIdkey(payload.sub);
    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado ou não autorizado');
    }
    return {
      idkey: usuario.idkey,
      username: usuario.username,
      email: usuario.email,
      tipo: usuario.tipo.descricao,
    };
  }
}