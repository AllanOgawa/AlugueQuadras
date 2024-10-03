import { Injectable } from '@nestjs/common';
import { CreateQuadraDto } from './dto/create-quadra.dto';
import { UpdateQuadraDto } from './dto/update-quadra.dto';

@Injectable()
export class QuadraService {
  create(createQuadraDto: CreateQuadraDto) {
    return 'This action adds a new quadra';
  }

  findAll() {
    return `This action returns all quadra`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quadra`;
  }

  update(id: number, updateQuadraDto: UpdateQuadraDto) {
    return `This action updates a #${id} quadra`;
  }

  remove(id: number) {
    return `This action removes a #${id} quadra`;
  }
}
