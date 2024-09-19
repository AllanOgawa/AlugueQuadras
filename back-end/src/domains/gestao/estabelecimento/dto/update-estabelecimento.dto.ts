import { IsString, MinLength } from "class-validator";

export class UpdateEstabelecimentoDto{
    @IsString()
    @MinLength(6,{
        message: 'A senha deve ter ao menos 6 caracteres'
    })
    senha: string;
}