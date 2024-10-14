import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost, PresignedPost } from '@aws-sdk/s3-presigned-post';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

import { GeneratePresignedUrlDto } from './dto/generate-presigned-url.dto';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly publicBucket: string;
  private readonly urlExpiration: number;

  constructor(private configService: ConfigService) {
    this.s3 = this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId:     this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
      endpoint: this.configService.get<string>('AWS_S3_ENDPOINT'),
      forcePathStyle: true, // Necessário para MinIO
    });    

    this.publicBucket   = this.configService.get<string>('AWS_S3_PUBLIC_BUCKET');
    this.urlExpiration  = parseInt(this.configService.get<string>('AWS_S3_URL_EXPIRATION'), 10);
  }


  private generateHashedFileName(username: string, originalName: string): string {
    const hash = crypto.createHash('sha256')
      .update(`${username}-${originalName}-${uuidv4()}`)
      .digest('hex');
    const extension = originalName.split('.').pop();
    return `${hash}.${extension}`;
  }


  async generatePresignedUrl(dto: GeneratePresignedUrlDto, username: string): Promise<{ url: string; fields: Record<string, string> }> {
    const { pathName, fileName, mimeType } = dto;

    const hashedFileName  = this.generateHashedFileName(username, fileName);
    const fullPath        = pathName.endsWith('/') ? pathName : `${pathName}/`;
    const key             = `${fullPath}${hashedFileName}`;

    try {
      const presignedPost: PresignedPost = await createPresignedPost(this.s3, {
        Bucket: this.publicBucket,
        Key: key,
        Expires: this.urlExpiration, // Tempo de expiração em segundos
        Fields: {
          key,
          'Content-Type': mimeType,
        },
        Conditions: [
          ['content-length-range', 0, 10485760], // 10 MB
          { 'Content-Type': mimeType },
        ],
      });

      return presignedPost; // { url, fields }
    } catch (error) {
      console.error('Erro ao gerar Presigned Post:', error);
      throw new InternalServerErrorException('Erro ao gerar URL pré-assinada para upload.');
    }
  }

}
