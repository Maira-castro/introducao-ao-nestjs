//REGRAS DE NEGOCIO 
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';


@Injectable()
export class UsersService {
   constructor(private prisma: PrismaService) { }
   
//CRIAR UM
   async create(data: Prisma.UserCreateInput): Promise<User> {
      return this.prisma.user.create({ data });
   }
   
//RETORNAR TODOS
   async findAll(): Promise<User[]> {
      return this.prisma.user.findMany()
   }
//PROCURAR UM
   async findOne(id: string): Promise<User | null> { //retorna um usuario ou null
      const found = await this.prisma.user.findUnique({
         where: {
            id: id
         }
      })
      if (!found) {
         throw new NotFoundException(`Usuario com o ID ${id} não encontrado!`)
      }
      return found
   }
//ATUALIZAR
   async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
      const updateUser = await this.prisma.user.update({ where: { id }, data })
      if (!updateUser) {
         throw new NotFoundException(`Usuario com o ID ${id} não encontrado!`)
      }
      return updateUser
   }
//REMOVER
   async remove(id: string): Promise<User | null> {
      const removedUser = await this.prisma.user.delete({ where: { id } })
      if (!removedUser) {
         throw new NotFoundException(`Usuario com o ID ${id} não encontrado!`)
      }
      return removedUser
   }
}