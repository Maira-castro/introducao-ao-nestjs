//REQUISIÇÕES
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';


//@UseGuards(JwtAuthGuard)//coloca aqui se quiser bloquear todas as rotas(geral)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) { }

   //CRIA UM NOVO USUARIO
   // @Post()
   // @ApiOperation({ summary: 'Criar um novo usuário!' }) //o que a rota vai fazer
   // @ApiBody({ type: CreateUserDto }) //tipo de dado que vai ser recebido
   // @ApiResponse({ status: 201, description: 'Usuário criado com sucesso!' })
   // @ApiResponse({ status: 400, description: 'erro de validação!' })
   //  @ApiResponse({ status: 500, description: 'erro interno no servidor!' })
   // create(@Body() data: Prisma.UserCreateInput) {
   //    return this.usersService.create(data);
   // }

   //RETORNA TODOS OS USUARIO


//   @UseGuards(AdminGuard)
//so permitir acesso para essa rota quem tiver token(em especifico)
   @Get()
   @ApiOperation({ summary: 'retorna todos os usuários!' })
   @ApiResponse({ status: 200, description: 'retorna todos os usuarios' })
   @ApiResponse({ status: 500, description: 'erro interno no servidor!' })
   findAll() {
      return this.usersService.findAll()
   }

   //RETORNA UM USUARIO ESPECIFICO PELO ID
   @Get(':id')
   @ApiOperation({ summary: 'retorna um usuário pelo id!' })
   @ApiResponse({ status: 200, description: 'Retorna as informações do usuario especifico!' })
   @ApiResponse({ status: 404, description: 'Usuario não encontrado!' })
   @ApiResponse({ status: 500, description: 'erro interno no servidor!' })
   findOne(@Param('id') id: string) {
      return this.usersService.findOne(id)
   }

   //ATUALIZA UM USUARIO
   @UseGuards(AdminGuard)
   @Put(':id')
   @ApiOperation({ summary: 'Atualiza um usuário!' })
   @ApiBody({ type: UpdateUserDto })
   @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso!' })
   @ApiResponse({ status: 404, description: 'Usuario não encontrado!' })
   @ApiResponse({ status: 500, description: 'erro interno no servidor!' })
   update(@Param('id') id: string, @Body() data: UpdateUserDto) {
      return this.usersService.update(id, data)
   }

   //DELETA UM USUARIO
   @UseGuards(AdminGuard)
   @Delete(':id')
   @ApiOperation({ summary: 'deleta um usuário!' })
   @ApiResponse({ status: 404, description: 'Usuario não encontrado!' })
   @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso!' })
   @ApiResponse({ status: 500, description: 'erro interno no servidor!' })
   remove(@Param('id') id: string) {
      return this.usersService.remove(id)
   }
}