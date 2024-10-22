import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { QuadraService } from '../quadra.service';
import { EstabelecimentoService } from '../../estabelecimento.service';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    private readonly quadraService: QuadraService,
    private readonly estabelecimento: EstabelecimentoService,
  ) { }

  async create(usuario: any, createReservaDto: CreateReservaDto): Promise<Reserva> {
    const { dataInicio, dataFim, idkeyQuadra } = createReservaDto;

    const quadra = await this.quadraService.findByIdkey(idkeyQuadra);

    // Verifica sobreposições de reservas
    const reservasExistentes = await this.reservaRepository.find({
      where: {
        quadra: { idkey: idkeyQuadra },
        dataInicio: LessThan(dataFim),
        dataFim: MoreThan(dataInicio),
      },
    });

    if (reservasExistentes.length > 0) {
      throw new BadRequestException('Já existe uma reserva nesse intervalo de tempo.');
    }

    // Cálculo da duração da reserva (em horas)
    const duracaoHoras = (dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60);
    if (duracaoHoras > 4) {
      throw new BadRequestException('A reserva não pode exceder 4 horas.');
    }

    // Verifica se as reservas estão dentro do horário permitido
    const horaInicio = dataInicio.getHours();
    const horaFim = dataFim.getHours();
    if (horaInicio < 8 || horaFim > 22) {
      throw new BadRequestException('Reservas devem ser realizadas entre 08:00 e 22:00.');
    }

    // Verifica se as reservas estão em intervalos de 30 minutos
    const minutosInicio = dataInicio.getMinutes();
    const minutosFim = dataFim.getMinutes();
    if (minutosInicio % 30 !== 0 || minutosFim % 30 !== 0) {
      throw new BadRequestException('Reservas devem iniciar e terminar em intervalos de 30 minutos.');
    }

    const reserva = this.reservaRepository.create({
      dataInicio,
      dataFim,
      usuario,
      quadra,
    });

    return this.reservaRepository.save(reserva);
  }

}
