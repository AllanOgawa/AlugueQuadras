import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

import { GeneratePresignedUrlDto } from './dto/generate-presigned-url.dto';

@Injectable()
export class StorageService {
  private readonly s3: AWS.S3;
  private readonly publicBucket: string;
  private readonly urlExpiration: number;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId:      this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey:  this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region:           this.configService.get<string>('AWS_REGION'),
      endpoint:         this.configService.get<string>('AWS_S3_ENDPOINT'),
      s3ForcePathStyle: true, // Necessário para MinIO
      signatureVersion: 'v4',
    });

    this.publicBucket   = this.configService.get<string>('AWS_S3_PUBLIC_BUCKET');
    this.urlExpiration  = parseInt(this.configService.get<string>('AWS_S3_URL_EXPIRATION'), 10);
  }


  private generateHashedFileName(username: string, originalName: string): string {
    const hash = crypto.createHash('sha256').update(`${username}-${originalName}-${uuidv4()}`).digest('hex');
    const extension = originalName.split('.').pop();
    return `${hash}.${extension}`;
  }


  async generatePresignedUrl(dto: GeneratePresignedUrlDto, username: string): Promise<{ url: string; fields: any }> {
    const { pathName, fileName, mimeType } = dto;

    const hashedFileName  = this.generateHashedFileName(username, fileName);
    const fullPath        = pathName.endsWith('/') ? pathName : `${pathName}/`;
    const key             = `${fullPath}${hashedFileName}`;

    const params: AWS.S3.PresignedPost.Params = {
      Bucket: this.publicBucket,
      Fields: {
        key,
        'Content-Type': mimeType,
      },
      Conditions: [
        ['content-length-range', 0, 10485760], // 10 MB
        { 'Content-Type': mimeType },
      ],
      Expires: this.urlExpiration,
    };

    try {
      const presignedPost = await this.s3.createPresignedPost(params);
      return presignedPost; // Retorna { url, fields }
    } catch (error) {
      console.error('Erro ao gerar Presigned Post:', error);
      throw new InternalServerErrorException('Erro ao gerar URL pré-assinada para upload.');
    }
  }

}
