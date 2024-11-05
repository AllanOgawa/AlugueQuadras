import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HorarioFuncionamentoService } from './horario-funcionamento.service';
import { CreateHorarioFuncionamentoDto } from './dto/create-horario-funcionamento.dto';
import { UpdateHorarioFuncionamentoDto } from './dto/update-horario-funcionamento.dto';

@Controller('horario-funcionamento')
export class HorarioFuncionamentoController {
  constructor(private readonly horarioFuncionamentoService: HorarioFuncionamentoService) { }

}
