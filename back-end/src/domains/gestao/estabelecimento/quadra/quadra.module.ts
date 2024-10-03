import { Module } from '@nestjs/common';
import { QuadraService } from './quadra.service';
import { QuadraController } from './quadra.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quadra } from './entities/quadra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quadra])],
  controllers: [QuadraController],
  providers: [QuadraService],
  exports: [QuadraService],
})
export class QuadraModule {}
