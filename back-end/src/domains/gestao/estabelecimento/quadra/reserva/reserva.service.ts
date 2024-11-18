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
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<Reserva>,

        @Inject(forwardRef(() => QuadraService))
        private readonly quadraService: QuadraService,
    ) { }

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
            throw new BadRequestException(
                'Erro ao encontrar reservas existentes.',
            );
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
            throw new BadRequestException(
                'A reserva não pode exceder 4 horas.',
            );
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
                    'Reserva não encontrada',
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
    async findAllByEstabelecimento(
        estabelecimentoId: number,
    ): Promise<Reserva[]> {
        try {
            const reservas = await this.reservaRepository.find({
                where: {
                    quadra: {
                        estabelecimento: {
                            idkey: estabelecimentoId,
                        },
                    },
                },
                relations: ['quadra', 'quadra.estabelecimento', 'usuario'],
            });
            return reservas;
        } catch (error) {
            throw new HttpException(
                'Erro ao buscar reservas do estabelecimento: ' + error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async findAvailableSlots(quadraIdkey: number): Promise<any> {
        try {
            const quadra = await this.quadraService.findByIdkey(quadraIdkey);

            if (!quadra) {
                console.error('Quadra não encontrada');
                throw new NotFoundException('Quadra não encontrada');
            }

            const estabelecimento = quadra.estabelecimento;
            const dataAtual = new Date();
            const dataAnterior = new Date(dataAtual);
            const horariosDisponiveisMap = new Map();

            for (let dia = 0; dia < 20; dia++) {
                const data = new Date(dataAnterior);
                data.setDate(dataAnterior.getDate() + dia);

                const diaSemana = data.getDay();
                const horarioFuncionamento =
                    estabelecimento.horariosFuncionamento.find(
                        (horario) => horario.diaSemana === diaSemana,
                    );

                if (!horarioFuncionamento) continue;

                const [horaAbertura, minutoAbertura] =
                    horarioFuncionamento.horaAbertura.split(':').map(Number);
                const horarioInicio = new Date(data);
                horarioInicio.setHours(horaAbertura, minutoAbertura, 0, 0);

                const [horaFechamento, minutoFechamento] =
                    horarioFuncionamento.horaFechamento.split(':').map(Number);
                const horarioFim = new Date(data);
                horarioFim.setHours(horaFechamento, minutoFechamento, 0, 0);

                let horaInicial = horarioInicio;
                const agora = new Date();

                if (data.toDateString() === dataAnterior.toDateString()) {
                    horaInicial = new Date(data);
                    horaInicial.setHours(agora.getHours() + 1, 0, 0, 0);

                    if (horaInicial > horarioFim) continue;
                }

                const reservasDia = await this.reservaRepository.find({
                    where: {
                        quadra: { idkey: quadraIdkey },
                        dataInicio: Between(
                            new Date(horarioInicio),
                            new Date(horarioFim),
                        ),
                    },
                });

                const horasDisponiveis = [];

                for (
                    let hora = new Date(horaInicial);
                    hora < horarioFim;
                    hora.setHours(hora.getHours() + 1)
                ) {
                    const horaInicioStr = hora.toTimeString().slice(0, 8);
                    const horaFim = new Date(hora);
                    horaFim.setHours(hora.getHours() + 1);
                    const horaFimStr = horaFim.toTimeString().slice(0, 8);

                    const isDisponivel = !reservasDia.some((reserva) => {
                        const conflitoInicio =
                            reserva.dataInicio <= hora &&
                            reserva.dataFim > hora;
                        const conflitoFim =
                            reserva.dataInicio < horaFim &&
                            reserva.dataFim >= horaFim;

                        if (conflitoInicio || conflitoFim) {
                            console.log('Conflito encontrado para horário:', {
                                horaInicio: horaInicioStr,
                                horaFim: horaFimStr,
                                reservaInicio: reserva.dataInicio,
                                reservaFim: reserva.dataFim,
                            });
                        }

                        return conflitoInicio || conflitoFim;
                    });

                    if (isDisponivel) {
                        horasDisponiveis.push({
                            horaInicio: horaInicioStr,
                            horaFim: horaFimStr,
                        });
                    }
                }

                if (horasDisponiveis.length > 0) {
                    const dataFormatada = data.toISOString().split('T')[0];
                    horariosDisponiveisMap.set(dataFormatada, horasDisponiveis);
                }
            }

            const horariosDisponiveis = Array.from(
                horariosDisponiveisMap,
                ([data, horas]) => ({ data, horas }),
            );

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
