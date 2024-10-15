import { Controller, Request, Post, UseGuards, Body, ValidationPipe, HttpStatus, HttpException, UnauthorizedException, BadRequestException, Get, Patch } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { GetProfileDto } from './dto/get-profile.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @ApiBody({ description: 'Login de usuário.' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    try{
      return await this.authService.login(req.user);
    }catch (error){
      console.error('Erro ao fazer login:', error);
      throw new HttpException('Erro ao fazer login', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBody({ description: 'Criação de um novo usuário.' })
  @Post('register')
  async register(@Body(ValidationPipe) createProfileDto: CreateProfileDto) {
    try{
      return this.authService.register(createProfileDto);
    }catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new HttpException('Erro ao criar usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @ApiBody({ description: 'Alteração de senha.' })
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body(ValidationPipe) changePasswordDTO: ChangePasswordDTO, @Request() req) {
    try {
      const userIdkey = req.user.idkey;
      await this.authService.changePassword(userIdkey, changePasswordDTO);
      return { message: 'Senha atualizada com sucesso.' };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException('Erro ao trocar senha', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiBody({ description: 'Retorna perfil completo do usuário' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<GetProfileDto> {
    const userIdkey = req.user.idkey;
    return this.authService.getProfile(userIdkey);
  }


  @ApiBody({ description: 'Atualização de dados do usuário' })
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto): Promise<GetProfileDto> {
    const userIdkey = req.user.idkey;
    return this.authService.updateProfile(userIdkey, updateProfileDto);
  }
}
