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
import { Repository, LessThan, MoreThan, Not } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { QuadraService } from '../quadra.service';
import { exec } from 'child_process';

@Injectable()
export class ReservaService {
    constructor(
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<Reserva>,

        @Inject(forwardRef(() => QuadraService))
        private readonly quadraService: QuadraService,
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
}
