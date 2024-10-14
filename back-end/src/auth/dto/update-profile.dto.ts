import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  nome?: string;
  
  @IsOptional()
  @IsString()
  imagem?: string; 
}