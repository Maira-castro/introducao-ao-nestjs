//////nao iremos usar mais essas rotas, apenas as de login e register


import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"
export class CreateUserDto {
    @ApiProperty({ example: 'Maira Castro', description: 'Nome completo do usuário!' })
    @IsNotEmpty({ message: 'nome é obrigatório!' }) //não permitir vazio
    @MinLength(4, { message: 'nome deve ter no minimo 4 caracteres!' }) //no minimo 4 caracteres
    name: string

    @ApiProperty({ example: 'Maira@gmail.com', description: 'email do usuario!' })
    @IsEmail({}, { message: 'email é obrigatório!' })
    email: string

}