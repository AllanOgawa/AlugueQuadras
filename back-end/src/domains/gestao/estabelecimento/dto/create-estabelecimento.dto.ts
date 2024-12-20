import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateEnderecoDto } from '@src/domains/geral/endereco/dto/create-endereco.dto';
import { Type } from 'class-transformer';
import { CreateHorarioFuncionamentoDto } from '../horario-funcionamento/dto/create-horario-funcionamento.dto';

export class CreateEstabelecimentoDto {
  @ApiProperty({
    description: 'CNPJ do estabelecimento',
    example: '12345678000195',
    type: String,
    minLength: 14,
    maxLength: 14,
  })
  @IsString({ message: 'O campo CNPJ deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo CNPJ não pode estar vazio.' })
  @Length(14, 14, {
    message: 'O campo CNPJ deve ter exatamente 14 caracteres.',
  })
  cnpj: string;

  @ApiProperty({
    description: 'Razão Social do estabelecimento',
    example: 'Empresa Exemplo Ltda',
    type: String,
  })
  @IsString({ message: 'O campo Razão Social deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo Razão Social não pode estar vazio.' })
  razaoSocial: string;

  @ApiProperty({
    description: 'Nome do Estabelecimento',
    example: 'Tenis Club',
    type: String,
  })
  @IsString({ message: 'O campo nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' })
  nome: string;

  @ApiProperty({
    description: 'Telefone do estabelecimento',
    example: '(11) 98765-4321',
    type: String,
  })
  @IsString({ message: 'O campo telefone deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo telefone não pode estar vazio.' })
  telefone: string;

  @ApiProperty({
    description: 'Email de contato do estabelecimento',
    example: 'contato@empresaexemplo.com.br',
    type: String,
  })
  @IsEmail(
    {},
    { message: 'O campo email deve ser um endereço de email válido.' },
  )
  @IsNotEmpty({ message: 'O campo email não pode estar vazio.' })
  email: string;

  @ApiProperty({
    description: 'Alvará de funcionamento do estabelecimento',
    example: 'ALVARA-123456',
    type: String,
  })
  @IsString({ message: 'O campo alvará deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo alvará não pode estar vazio.' })
  alvara: string;

  @ApiProperty({
    description: 'Informações do estabelecimento',
    example: 'O Tenis Club é um estabelecimento que oferece quadras de tênis para locação.',
    type: String
  })
  @IsString({ message: 'O campo sobre deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo sobre não pode estar vazio.' })
  sobre: string;

  @ApiProperty({
    description: 'Endereço do estabelecimento',
    type: CreateEnderecoDto,
  })
  @ValidateNested()
  @Type(() => CreateEnderecoDto)
  @IsNotEmpty({ message: 'O campo endereco não pode estar vazio.' })
  endereco: CreateEnderecoDto;

  @ApiProperty({
    description: 'Lista de imagens para adicionar.',
    example: ['estabelecimento/imagem1.jpg', 'estabelecimento/imagem2.png'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  imagensToAdd?: string[];

  @ApiProperty({
    description: 'Array com IDs das acomodacoes a serem adicionados à quadra',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray({ message: 'O campo acomodacoesToAdd deve ser um array de IDs.' })
  acomodacoesToAdd?: number[];

  @ApiProperty({
    description: 'Horários de funcionamento do estabelecimento',
    type: CreateHorarioFuncionamentoDto
  })
  @ValidateNested()
  @Type(() => CreateHorarioFuncionamentoDto)
  @IsNotEmpty({ message: 'O campo horarioFuncionamento não pode estar vazio.' })
  horariosFuncionamento: CreateHorarioFuncionamentoDto[];
}
