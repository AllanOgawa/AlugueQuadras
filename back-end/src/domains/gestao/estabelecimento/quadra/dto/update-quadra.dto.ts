import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class UpdateQuadraDto {
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @IsOptional()
  nome?: string;

  @IsString({ message: 'O campo informações adicionais deve ser uma string.' })
  @IsOptional()
  informacoesAdicionais?: string;

  @IsNumber({}, { message: 'O campo valor deve ser um número.' })
  @IsOptional()
  valor?: number;

  @IsOptional()
  imagem?: string;

  @IsArray({ message: 'O campo tiposEsporte deve ser um array de IDs.' })
  @IsOptional()
  tiposEsporte?: number[];
}
