import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { JwtAuthGuard } from '@src/domains/auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Reserva } from './entities/reserva.entity';

@ApiTags("Reserva")
@Controller('estabelecimento/quadra/reserva')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) { }

  @Post('new')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Criar uma nova reserva' })
  @ApiResponse({ status: 201, description: 'Reserva criada com sucesso', type: Reserva })
  @ApiResponse({ status: 500, description: 'Erro ao criar reserva' })
  async create(@Body() createReservaDto: CreateReservaDto, @Request() req) {
    try {
      return await this.reservaService.create(req.user, createReservaDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro ao criar reserva', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
