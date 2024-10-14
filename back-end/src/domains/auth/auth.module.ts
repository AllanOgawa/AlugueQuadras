import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UsuarioModule }      from './usuario/usuario.module';
import { AuthController }     from './auth.controller';
import { AuthService }        from './auth.service';

import { LocalStrategy }      from './strategies/local-auth.strategy';
import { JwtStrategy }        from './strategies/jwt-auth.strategy';

@Module({
  imports: [
    UsuarioModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' }, // Token deve expirar?
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
