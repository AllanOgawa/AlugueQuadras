import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateQuadraDto {
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' })
  nome: string;

  @IsString({ message: 'O campo informações adicionais deve ser uma string.' })
  @IsOptional()
  informacoesAdicionais?: string;

  @IsNumber({}, { message: 'O campo valor deve ser um número.' })
  @IsNotEmpty({ message: 'O campo valor não pode estar vazio.' })
  valor: number;

  @IsString({ message: 'O campo imagem deve ser uma string (path do bucket).' })
  @IsOptional()
  imagem?: string;

  @IsArray({ message: 'O campo tiposEsporte deve ser um array de IDs.' })
  @IsNotEmpty({ message: 'O campo tiposEsporte não pode estar vazio.' })
  tiposEsporte: number[]; // IDs dos tipos de esporte que a quadra suporta

  @IsNumber({}, { message: 'O campo idkeyEstabelecimento deve ser um número.' })
  @IsNotEmpty({ message: 'O campo idkeyEstabelecimento não pode estar vazio.' })
  idkeyEstabelecimento: number; // ID do estabelecimento ao qual a quadra pertence
}
