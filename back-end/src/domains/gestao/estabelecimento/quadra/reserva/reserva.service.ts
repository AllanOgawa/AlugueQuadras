import { Injectable, BadRequestException, NotFoundException, HttpException, HttpStatus, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Not } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { QuadraService } from '../quadra.service';
import { UpdateReservaDto } from './dto/update-reserva.dto';

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

    console.log(reserva)

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


  async update(idkey: number, updateReservaDto: UpdateReservaDto): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({ where: { idkey }, relations: ['quadra', 'usuario'] });
    if (!reserva) {
      throw new NotFoundException('Reserva não encontrada');
    }

    const { dataInicio, dataFim } = updateReservaDto;

    // Atualizar dataInicio e dataFim se fornecidos
    if (dataInicio !== undefined) {
      reserva.dataInicio = dataInicio;
    }
    if (dataFim !== undefined) {
      reserva.dataFim = dataFim;
    }

    // Verificações de sobreposição somente se dataInicio ou dataFim foram atualizados
    if (dataInicio !== undefined || dataFim !== undefined) {
      // Garantir que dataFim > dataInicio (já validado pelo DTO)
      // Verifica sobreposições de reservas
      const reservasExistentes = await this.reservaRepository.find({
        where: {
          quadra: { idkey: reserva.quadra.idkey },
          idkey: Not(idkey), // Excluir a própria reserva da verificação
          dataInicio: LessThan(reserva.dataFim),
          dataFim: MoreThan(reserva.dataInicio),
        },
      });

      if (reservasExistentes.length > 0) {
        throw new BadRequestException('Já existe uma reserva nesse intervalo de tempo.');
      }

      // Cálculo da duração da reserva (em horas)
      const duracaoHoras = (reserva.dataFim.getTime() - reserva.dataInicio.getTime()) / (1000 * 60 * 60);
      if (duracaoHoras > 4) {
        throw new BadRequestException('A reserva não pode exceder 4 horas.');
      }

      // Verifica se as reservas estão dentro do horário permitido
      const horaInicio = reserva.dataInicio.getHours();
      const horaFim = reserva.dataFim.getHours();
      if (horaInicio < 8 || horaFim > 22) {
        throw new BadRequestException('Reservas devem ser realizadas entre 08:00 e 22:00.');
      }

      // Verifica se as reservas estão em intervalos de 30 minutos
      const minutosInicio = reserva.dataInicio.getMinutes();
      const minutosFim = reserva.dataFim.getMinutes();
      if (minutosInicio % 30 !== 0 || minutosFim % 30 !== 0) {
        throw new BadRequestException('Reservas devem iniciar e terminar em intervalos de 30 minutos.');
      }
    }

    return this.reservaRepository.save(reserva);
  }

}
