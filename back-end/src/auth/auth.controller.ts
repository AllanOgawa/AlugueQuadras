import { Controller, Request, Post, UseGuards, Body, ValidationPipe, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from '../admin/usuario/dto/create-usuario.dto';
import { ApiTags } from '@nestjs/swagger';

import { LocalAuthGuard } from './guard/local-auth.guard';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    try{
      return this.authService.login(req.user);
    }catch (error){
      console.error('Erro ao fazer login:', error);
      throw new HttpException('Erro ao fazer login', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('register')
  async register(@Body(ValidationPipe) createUsuarioDto: CreateUsuarioDto) {
    try{
      return this.authService.register(createUsuarioDto);
    }catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new HttpException('Erro ao criar usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
