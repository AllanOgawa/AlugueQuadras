import { PartialType } from '@nestjs/swagger';
import { CreateUsuarioTipoDto } from './create-tipo.dto';

export class UpdateUsuarioTipoDto extends PartialType(CreateUsuarioTipoDto) {}
