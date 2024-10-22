import { PartialType } from '@nestjs/swagger';
import { CreateReservaDto } from './create-reserva.dto';

export class UpdateReservaDto extends PartialType(CreateReservaDto) {}
