//RESPONSAVEL POR BARRAR ACESSOS QUE NAO TIVEREM UM TOKEN
import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}//VERIFICA DO JWT.STRATEGY.TS