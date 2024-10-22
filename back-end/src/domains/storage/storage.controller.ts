import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';

import { JwtAuthGuard } from '@domains/auth/guard/jwt-auth.guard';
import { StorageService } from './storage.service';

import { GeneratePresignedUrlDto } from './dto/generate-presigned-url.dto';

@ApiTags('Storage')
@UseGuards(JwtAuthGuard)
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Gerar URL pré-assinada para upload de imagem' })
  @ApiResponse({
    status: 201,
    description: 'URL pré-assinada gerada com sucesso.',
    schema: {
      example: {
        url: 'https://s3.aluguequadras.com.br/public-storage',
        fields: {
          key: 'path/hashed-filename.png',
          'Content-Type': 'image/png',
          // outros campos necessários
        },
      },
    },
  })
  @ApiBody({ type: GeneratePresignedUrlDto })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('upload-url')
  async getUploadUrl(@Request() req, @Body() dto: GeneratePresignedUrlDto): Promise<{ url: string; fields: any }> {
    
    const usuario = req.user;

    if (!usuario || !usuario.username) {
      throw new HttpException('Usuário não autenticado.', HttpStatus.UNAUTHORIZED);
    }

    const presignedPost = await this.storageService.generatePresignedUrl(dto, usuario.username);

    return { url: presignedPost.url, fields: presignedPost.fields };
  }

}
