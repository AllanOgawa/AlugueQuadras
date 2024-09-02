import { Injectable } from '@nestjs/common';
import { CreateEstabelecimentoDto } from './dto/create-estabelecimento.dto';
import { UpdateEstabelecimentoDto } from './dto/update-estabelecimento.dto';

@Injectable()
export class EstabelecimentoService {
  create(createEstabelecimentoDto: CreateEstabelecimentoDto) {
    return 'This action adds a new estabelecimento';
  }

  findAll() {
    return `This action returns all estabelecimento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} estabelecimento`;
  }

  update(id: number, updateEstabelecimentoDto: UpdateEstabelecimentoDto) {
    return `This action updates a #${id} estabelecimento`;
  }

  remove(id: number) {
    return `This action removes a #${id} estabelecimento`;
  }
}
