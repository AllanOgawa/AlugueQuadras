import { PartialType } from '@nestjs/swagger';
import { CreateQuadraDto } from './create-quadra.dto';

export class UpdateQuadraDto extends PartialType(CreateQuadraDto) {}
