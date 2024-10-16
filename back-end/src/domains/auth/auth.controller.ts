import { Controller, Request, Post, UseGuards, Body, ValidationPipe, HttpStatus, HttpException, UnauthorizedException, BadRequestException, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

import { LoginDto }           from './dto/login.dto';
import { CreateProfileDto }   from './dto/create-profile.dto';
import { UpdateProfileDto }   from './dto/update-profile.dto';
import { ChangePasswordDTO }  from './dto/change-password.dto';
import { GetProfileDto }      from './dto/get-profile.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @ApiOperation({ summary: 'Login de usuário.' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @ApiBody({ description: 'Login de usuário.' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto, @Request() req) {
    try{
      return await this.authService.login(req.user);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw new HttpException('Erro ao fazer login', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Criação de um novo usuário.' })
  @ApiBody({ type: CreateProfileDto })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @Post('register')
  async register(@Body(ValidationPipe) createProfileDto: CreateProfileDto) {
    try {
      return this.authService.register(createProfileDto);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw new HttpException('Erro ao criar usuário', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alteração de senha.' })
  @ApiBody({ type: ChangePasswordDTO })
  @ApiResponse({ status: 200, description: 'Senha atualizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna perfil completo do usuário.' })
  @ApiResponse({ status: 200, description: 'Perfil obtido com sucesso.', type: GetProfileDto })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<GetProfileDto> {
    const userIdkey = req.user.idkey;
    return this.authService.getProfile(userIdkey);
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualização de dados do usuário.' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso.', type: GetProfileDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @UseGuards(JwtAuthGuard)
  @Patch('profile/edit')
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto): Promise<GetProfileDto> {
    const userIdkey = req.user.idkey;
    return this.authService.updateProfile(userIdkey, updateProfileDto);
  }
}
