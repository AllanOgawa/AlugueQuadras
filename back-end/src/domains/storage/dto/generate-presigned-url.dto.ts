import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeneratePresignedUrlDto {

  @ApiProperty({
    description: 'Path da imagem',
  })
  @IsString()
  @IsNotEmpty()
  pathName: string;

  @ApiProperty({
    description: 'Nome original da imagem',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description: 'Tipo MIME da imagem',
    example: 'image/png',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/image\/(jpeg|png|gif)/, { message: 'Apenas imagens JPEG, PNG e GIF são permitidas.' })
  mimeType: string;

}