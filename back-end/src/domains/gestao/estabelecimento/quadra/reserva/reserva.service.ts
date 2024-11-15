import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Not, Between } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { QuadraService } from '../quadra.service';
import { DiaSemana } from '../../horario-funcionamento/enums/dia-semana.enum';

@Injectable()
export class ReservaService {
  constructor(
    @Inject(forwardRef(() => QuadraService))
    private readonly quadraService: QuadraService,

    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
  ) {}

  async create(
    usuario: any,
    createReservaDto: CreateReservaDto,
  ): Promise<Reserva> {
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
      throw new BadRequestException(
        'Já existe uma reserva nesse intervalo de tempo.',
      );
    }

    // Cálculo da duração da reserva (em horas)
    const duracaoHoras =
      (dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60);
    if (duracaoHoras > 4) {
      throw new BadRequestException('A reserva não pode exceder 4 horas.');
    }

    // Verifica se as reservas estão dentro do horário permitido
    const horaInicio = dataInicio.getUTCHours();
    const horaFim = dataFim.getUTCHours();
    if (horaInicio < 8 || horaFim > 22) {
      throw new BadRequestException(
        'Reservas devem ser realizadas entre 08:00 e 22:00.',
      );
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
      console.log(error);
      throw new HttpException(
        'Erro ao criar reserva: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllByUser(userId: number): Promise<Reserva[]> {
    try {
      const reservas = await this.reservaRepository.find({
        where: { usuario: { idkey: userId }, cancelada: false },
        relations: ['quadra', 'quadra.estabelecimento'],
      });

      reservas.forEach((reserva) => {
        delete reserva.usuario;
      });
      return reservas;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar reservas do usuário' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancelar(id: number): Promise<void> {
    try {
      const reserva = await this.reservaRepository.findOne({
        where: { idkey: id },
      });

      if (!reserva) {
        throw new HttpException(
          'Reserva não encontradaa',
          HttpStatus.NOT_FOUND,
        );
      }

      if (reserva.cancelada) {
        throw new HttpException(
          'Reserva já está cancelada',
          HttpStatus.BAD_REQUEST,
        );
      }

      reserva.cancelada = true;
      await this.reservaRepository.save(reserva);
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error.message);
      throw new HttpException(
        'Erro ao cancelar reserva',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAvailableSlots(quadraIdkey: number): Promise<any> {
    try {
      console.log(`Buscando quadra com idkey: ${quadraIdkey}`);
      const quadra = await this.quadraService.findByIdkey(quadraIdkey);

      if (!quadra) {
        console.error('Quadra não encontrada');
        throw new NotFoundException('Quadra não encontrada');
      }

      const estabelecimento = quadra.estabelecimento;
      console.log(`Estabelecimento encontrado: ${estabelecimento.idkey}`);

      const dataAtual = new Date();
      const horariosDisponiveis = [];

      for (let dia = 0; dia < 20; dia++) {
        const data = new Date(dataAtual);
        data.setDate(dataAtual.getDate() + dia);

        const diaSemana = data.getDay();
        console.log(`Verificando horários para o dia da semana: ${diaSemana}`);

        const horarioFuncionamento = estabelecimento.horariosFuncionamento.find(
          (horario) => horario.diaSemana === diaSemana,
        );

        if (!horarioFuncionamento) {
          console.log(
            `Nenhum horário de funcionamento encontrado para o dia ${diaSemana}`,
          );
          continue;
        }

        console.log(
          `Horário de funcionamento encontrado: Abertura - ${horarioFuncionamento.horaAbertura}, Fechamento - ${horarioFuncionamento.horaFechamento}`,
        );

        const [horaA, minutoA] = horarioFuncionamento.horaAbertura
          .split(':')
          .map(Number);
        const horarioInicio = new Date(data);
        horarioInicio.setHours(horaA, minutoA, 0, 0);

        const [horaF, minutoF] = horarioFuncionamento.horaFechamento
          .split(':')
          .map(Number);
        const horarioFim = new Date(data);
        horarioFim.setHours(horaF, minutoF, 0, 0);

        console.log(
          `Horário de início: ${horarioInicio.toISOString()}, Horário de fim: ${horarioFim.toISOString()}`,
        );

        const reservasDia = await this.reservaRepository.find({
          where: {
            quadra: quadra,
            dataInicio: Between(
              new Date(data.setHours(horaA, 0, 0, 0)),
              new Date(data.setHours(horaF, 59, 59, 999)),
            ),
          },
        });

        console.log(
          `Reservas para o dia ${data.toISOString().split('T')[0]}:`,
          reservasDia,
        );

        const horasDisponiveis = [];

        for (
          let hora = new Date(horarioInicio);
          hora < horarioFim;
          hora.setHours(hora.getHours() + 1)
        ) {
          const horaInicioStr = hora.toTimeString().slice(0, 8);
          const horaFimStr = new Date(hora);
          horaFimStr.setHours(hora.getHours() + 1);

          if (
            !reservasDia.some(
              (reserva) => reserva.dataInicio <= hora && reserva.dataFim > hora,
            )
          ) {
            horasDisponiveis.push({
              horaInicio: horaInicioStr,
              horaFim: horaFimStr.toTimeString().slice(0, 8),
            });
          }
        }

        if (horasDisponiveis.length > 0) {
          horariosDisponiveis.push({
            data: data.toISOString().split('T')[0],
            horas: horasDisponiveis,
          });
        }
      }

      return horariosDisponiveis;
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      throw new HttpException(
        'Erro ao buscar horários disponíveis',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
