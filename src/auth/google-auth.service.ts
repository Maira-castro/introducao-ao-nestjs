import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleService {
    private client: OAuth2Client

    constructor(private authService: AuthService) { this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID) }

    async verify(idToken: string) {
        const ticket = await this.client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        const payload = ticket.getPayload()
        if (!payload) throw new UnauthorizedException('Token inválido!')
        
        const {sub, email, name} = payload

        //Criar o usuário se ele não tiver conta na API
        //ou Logar o usuário se já tiver conta

        const user = await this.authService.findCreateGoogleUser({ //função vindo lá de auth.service.ts
            googleId: sub,
            email,
            name
        })

        return this.authService.signJwtForUser(user)
        
    }

}