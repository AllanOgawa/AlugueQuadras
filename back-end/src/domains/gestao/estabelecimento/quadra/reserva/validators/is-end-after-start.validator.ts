import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { CreateReservaDto } from '../dto/create-reserva.dto';

@ValidatorConstraint({ name: 'isEndAfterStart', async: false })
export class IsEndAfterStart implements ValidatorConstraintInterface {
  validate(endDate: Date, args: ValidationArguments) {
    const object = args.object as CreateReservaDto;
    return endDate > object.dataInicio;
  }

  defaultMessage(args: ValidationArguments) {
    return 'A data de término deve ser posterior à data de início.';
  }
}
