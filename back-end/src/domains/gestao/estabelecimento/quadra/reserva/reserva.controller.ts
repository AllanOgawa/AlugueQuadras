import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    UseGuards,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { JwtAuthGuard } from '@src/domains/auth/guard/jwt-auth.guard';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Reserva } from './entities/reserva.entity';

@ApiTags('Reserva')
@Controller('estabelecimento/quadra/reserva')
export class ReservaController {
    constructor(private readonly reservaService: ReservaService,
    ) { }

    @Post('new')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Criar uma nova reserva' })
    @ApiResponse({
        status: 201,
        description: 'Reserva criada com sucesso',
        type: Reserva,
    })
    @ApiResponse({ status: 500, description: 'Erro ao criar reserva' })
    async create(@Body() createReservaDto: CreateReservaDto, @Request() req) {
        try {
            return await this.reservaService.create(req.user, createReservaDto);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(
                    'Erro ao criar reserva',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    @Get('list')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Listar todas as reservas do usuário autenticado',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de reservas do usuário autenticado',
        type: [Reserva],
    })
    @ApiResponse({ status: 401, description: 'Acesso não autorizado' })
    async findAllByUser(@Request() req): Promise<Reserva[]> {
        try {
            const userId = req.user.idkey;
            if (!userId) {
                throw new HttpException(
                    'Usuário não autenticado ou token inválido',
                    HttpStatus.UNAUTHORIZED,
                );
            }
            return await this.reservaService.findAllByUser(userId);
        } catch (error) {
            console.log('Erro ao buscar reservas do usuário:', error.message);
            console.log(error.stack);
            throw new HttpException(
                'Erro ao buscar reservas do usuário',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Patch('cancelar/:idkey')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('acess-token')
    @ApiOperation({ summary: 'Cancelar uma reserva por ID' })
    @ApiParam({
        name: 'idkey',
        description: 'ID da reserva a ser cancelada',
        example: 21,
    })
    @ApiResponse({ status: 400, description: 'Acesso não autorizado' })
    @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
    @ApiResponse({ status: 500, description: 'Erro ao cancelar reserva' })
    async cancelar(
        @Param('idkey') idkey: number,
        @Request() req,
    ): Promise<void> {
        try {
            const usuario = req.user;
            await this.reservaService.cancelar(idkey);
        } catch (error) {
            console.error('Erro ao cancelar reserva:', error.message);
            throw new HttpException(
                'Erro ao cancelar reserva',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('list-by-estabelecimento/:estabelecimentoId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Listar todas as reservas de um estabelecimento' })
    @ApiResponse({
        status: 200,
        description: 'Lista de reservas do estabelecimento',
        type: [Reserva],
    })
    @ApiResponse({ status: 401, description: 'Acesso não autorizado' })
    @ApiResponse({ status: 404, description: 'Estabelecimento não encontrado' })
    async findAllByEstabelecimento(
        @Param('estabelecimentoId') estabelecimentoId: number,
        @Request() req,
    ): Promise<Reserva[]> {
        try {
            const userId = req.user.idkey;
            if (!userId) {
                throw new HttpException(
                    'Usuário não autenticado ou token inválido',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            return await this.reservaService.findAllByEstabelecimento(
                estabelecimentoId,
            );
        } catch (error) {
            console.log(
                'Erro ao buscar reservas do estabelecimento:',
                error.message,
            );
            console.log(error.stack);
            throw new HttpException(
                'Erro ao buscar reservas do estabelecimento',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }


    @Get('quadra/:quadraIdkey/available-slots')
    @ApiOperation({
        summary: 'Listar horários disponíveis para uma quadra específica',
    })
    @ApiParam({
        name: 'quadraIdkey',
        description: 'ID da quadra para a qual listar os horários disponíveis',
        example: 1,
    })
    @ApiResponse({
        status: 200,
        description: 'Horários disponíveis retornados com sucesso',
    })
    @ApiResponse({ status: 404, description: 'Quadra não encontrada' })
    @ApiResponse({
        status: 500,
        description: 'Erro ao buscar horários disponíveis',
    })
    async findAvailableSlots(@Param('quadraIdkey') quadraIdkey: number) {
        try {
            return await this.reservaService.findAvailableSlots(quadraIdkey);
        } catch (error) {
            console.error('Erro ao buscar horários disponíveis:', error.message);
            throw new HttpException(
                'Erro ao buscar horários disponíveis',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
