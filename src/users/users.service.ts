// logica com banco de dados
import { Injectable } from "@nestjs/common";

@Injectable() //transforma em uma classe que pode ser usada por outra

export class UserService {

    //banco de dados fake (array em memoria)
    private users = [ //um atributo
        { id: 1, name: 'luisa', email: 'luisa@gmail.com' },
        { id: 2, name: 'maria', email: 'maria@gmail.com' }
    ]

    //metodo que retorne todos os usuarios do bd fake
    findAll(): { id: number, name: string, email: string }[] {
        return this.users
    }

    create(user: { name: string, email: string }): string {
        const newUser = {
            id: this.users.length + 1,
            name: user.name,
            email: user.email,
        }
        this.users.push(newUser)

        return `usuario ${newUser.name} criado com id ${newUser.id}`
    }

    //buscar usuario por id
    findOne(id: number): { id: Number, name: String, email: String } | undefined { //resultado pode ser isso ou isso
        const foundUser = this.users.find((u) => u.id === id)
        return foundUser
    }

    update(id: number, user: { name: string, email: string }): string {
        const foundUser = this.users.findIndex((u) => u.id === id)
        if (foundUser !== -1) {
            const attUser = {
                id: id,
                name: user.name,
                email: user.email
            }

            this.users.splice(foundUser, 1, attUser)
            return 'usuario atualizado'
        } else {
            return 'usuario nao encontrado'
        }
    }
}