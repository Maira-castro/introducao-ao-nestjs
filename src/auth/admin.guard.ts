//VERIFICA SE O DONO DO TOKEN É ADMIN
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean { //retorna verdadeiro ou falso
    const request = context.switchToHttp().getRequest();
    console.log('Payload do usuário:', request.user);
    const user = request.user; //da requisição pega o usuario/payload
    return user?.role === 'ADMIN'; //verifica se é admin
  }
}
