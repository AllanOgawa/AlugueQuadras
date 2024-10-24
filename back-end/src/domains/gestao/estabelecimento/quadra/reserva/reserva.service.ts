import { Injectable, BadRequestException, NotFoundException, HttpException, HttpStatus, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Not } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { QuadraService } from '../quadra.service';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,

    @Inject(forwardRef(() => QuadraService))
    private readonly quadraService: QuadraService
  ) { }

  async create(usuario: any, createReservaDto: CreateReservaDto): Promise<Reserva> {
    let reservasExistentes;
    const { dataInicio, dataFim, idkeyQuadra } = createReservaDto;

    const quadra = await this.quadraService.findByIdkey(idkeyQuadra);

    try {
      reservasExistentes = await this.reservaRepository.find({
        where: {
          quadra: { idkey: idkeyQuadra },
          dataInicio: LessThan(dataFim),
          dataFim: MoreThan(dataInicio),
        },
      });
    } catch (error) {
      throw new BadRequestException('Erro ao encontrar reservas existentes.');
    }

    // Verifica sobreposições de reservas
    if (reservasExistentes.length > 0) {
      throw new BadRequestException('Já existe uma reserva nesse intervalo de tempo.');
    }

    // Cálculo da duração da reserva (em horas)
    const duracaoHoras = (dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60);
    if (duracaoHoras > 4) {
      throw new BadRequestException('A reserva não pode exceder 4 horas.');
    }

    // Verifica se as reservas estão dentro do horário permitido
    const horaInicio = dataInicio.getUTCHours();
    const horaFim = dataFim.getUTCHours();
    if (horaInicio < 8 || horaFim > 22) {
      throw new BadRequestException('Reservas devem ser realizadas entre 08:00 e 22:00.');
    }

    const reserva = this.reservaRepository.create({
      dataInicio,
      dataFim,
      quadra,
      usuario,
    });

    try {
      return this.reservaRepository.save(reserva);
    } catch (error) {
      console.log(error)
      throw new HttpException(
        'Erro ao criar reserva: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
