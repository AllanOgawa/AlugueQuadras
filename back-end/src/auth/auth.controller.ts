import { Controller, Request, Post, UseGuards, Body, ValidationPipe, HttpStatus, HttpException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from '../admin/usuario/dto/create-usuario.dto';
import { ApiTags } from '@nestjs/swagger';

import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { MudarSenhaDto } from './dto/mudar-senha';

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

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body(ValidationPipe) mudarSenhaDto: MudarSenhaDto, @Request() req) {
    try {
      const userId = req.user.userId;
      await this.authService.changePassword(userId, mudarSenhaDto);
      return { message: 'Senha atualizada com sucesso.' };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException('Erro ao trocar senha', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
