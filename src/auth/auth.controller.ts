import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ApiTags, ApiBody, ApiCreatedResponse, ApiConflictResponse, ApiParam } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiBody({ type: RegisterUserDto })
    @ApiCreatedResponse({ description: 'Usuário registrado com sucesso' })
    @ApiConflictResponse({ description: 'Email já em uso' })
    async register(@Body() userData: RegisterUserDto) {
        return this.authService.register(userData);
    }

    @Post('login')
    @ApiBody({ type: LoginDto })
    async login(@Body() credentials: LoginDto): Promise<LoginResponseDto> { //vai retorna a resposta do LoginResponseDto
        return this.authService.login(credentials);
    }

}


//starbootstrap.com/previews/sb-admin-2