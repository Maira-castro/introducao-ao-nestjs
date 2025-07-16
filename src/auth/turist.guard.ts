//VERIFICA SE O DONO DO TOKEN É ADMIN
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TuristaGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean { //retorna verdadeiro ou falso
    const request = context.switchToHttp().getRequest();
    const user = request.user; //da requisição pega o usuario/payload
    return user?.role === 'TURISTA'; //verifica se é turista
  }
}