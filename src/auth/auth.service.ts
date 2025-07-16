//serviços de autenticação

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwt: JwtService,
        private readonly prisma: PrismaService
    ) { }

    async register(userData: RegisterUserDto) { //função para registrar novo usuario

        //verifica se usuario já existe no BD
        const userExists = await this.prisma.user.findUnique({ where: { email: userData.email } });
        if (userExists) throw new ConflictException('Email já está em uso!');

        //INICIA O PROCESSO DE CADASTRO DO USUARIO

        //criptografa a senha
        const hashedPassword = await bcrypt.hash(userData.password, 10)
        if (!hashedPassword) throw new UnauthorizedException('Credenciais inválidas');

        //cria o novo usuario
        const newUser = await this.prisma.user.create({
            data: { //cria
                name: userData.name,
                email: userData.email,
                password: hashedPassword
            },
            select: { //seleciona os dados que quer retornar
                id: true,
                name: true,
                email: true,
                role: true
            }
        })

        return newUser; //retorna o usuario
    }

    //(1 etapa no processo de login)
    async validateUser(email: string, password: string) { //validar o usuario para saber se ele existe no BD

        const user = await this.prisma.user.findUnique({ where: { email } }); //procura o usuario por email
        if (!user) throw new UnauthorizedException('Credenciais inválidas');//se o usuario nao existir

        const isMatch = await bcrypt.compare(password, user.password); //verifica se a senha é valida
        if (!isMatch) throw new UnauthorizedException('Credenciais inválidas'); //se a senha não for igual

        return user;//retorna usuario encontrado
    }

    async login(credentials: LoginDto) { //função para logar usuario

 //recebe o usuario que esta sendo logado que vem do metodo validateUser() que verifica se email e senha esta certo
        const user = await this.validateUser(credentials.email, credentials.password);

        const payload = { // define o que vai ser retornado no token 
            sub: user.id, //id dele
            role: user.role, //tipo de usuario
            email: user.email, //email
        };

        return {
            access_token: this.jwt.sign(payload), //cria e retorna o token
        };
    }

}