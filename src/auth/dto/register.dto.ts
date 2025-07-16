import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MinLength } from "class-validator"

export class RegisterUserDto {

    @ApiProperty({ description:'Nome do usuário.', example: 'Maira Castro' })
    @IsString()
    name: string

    @ApiProperty({ description:'Email do usuário.', example: 'example@gmail.com' })
    @IsEmail()
    email: string

    @ApiProperty({ description:'Senha do usuário.', example: 'senha123' })
    @IsString()
    @MinLength(6)
    password: string

}