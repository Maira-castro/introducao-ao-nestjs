import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ApiTags, ApiBody, ApiCreatedResponse, ApiConflictResponse, ApiParam } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register.dto';
import { GoogleService } from './google-auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        private googleService: GoogleService
    ) { }

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

    @Post('/google')
    async loginWithGoogle(@Body() body: {idToken:string}) {
        const access_token = await this.googleService.verify(
            body.idToken
        )
        return {access_token}
    }

}


//starbootstrap.com/previews/sb-admin-2