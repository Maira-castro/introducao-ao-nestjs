//DELIMITAR QUEM VAI PODER ACESSAR DETERMINADAS ROTAS
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //extrair jwt
      secretOrKey: 'meu_segredo', // ideal usar .env
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role }; //retorna as informações do payload
  }
}