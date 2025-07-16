import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator'

export class LoginDto {
    @ApiProperty({ description:'Email do usuário.', example: 'example@gmail.com' })
    @IsEmail({}, { message: 'email precisa ser válido.' })
    email: string;

    @ApiProperty({description:'Senha do usuário.', example: 'senha123' })
    @IsString({ message: 'a senha precisa conter letras.' })
    password: string
}