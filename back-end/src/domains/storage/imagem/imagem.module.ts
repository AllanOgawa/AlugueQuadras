import { Module }             from '@nestjs/common';
import { ImagemService }      from './imagem.service';

import { Imagem }             from './entities/imagem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Imagem]),
  ],
  providers: [ImagemService],
  exports: [ImagemService],
})
export class ImagemModule {}
