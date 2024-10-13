import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  nome?: string;
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagensToAdd?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagensToRemove?: string[]; 
}