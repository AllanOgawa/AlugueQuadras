import { Injectable } from '@nestjs/common';
import { CreateHorariofuncionamentoDto } from './dto/create-horariofuncionamento.dto';
import { UpdateHorariofuncionamentoDto } from './dto/update-horariofuncionamento.dto';

@Injectable()
export class HorariofuncionamentoService {
  create(createHorariofuncionamentoDto: CreateHorariofuncionamentoDto) {
    return 'This action adds a new horariofuncionamento';
  }

  findAll() {
    return `This action returns all horariofuncionamento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} horariofuncionamento`;
  }

  update(id: number, updateHorariofuncionamentoDto: UpdateHorariofuncionamentoDto) {
    return `This action updates a #${id} horariofuncionamento`;
  }

  remove(id: number) {
    return `This action removes a #${id} horariofuncionamento`;
  }
}
