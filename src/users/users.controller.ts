//NOSSAS ROTAS E RESPOSTAS
import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./users.service";


@Controller('user') //vai ser o endpont principal //transforma em controller
export class UserController {

    constructor(private userService: UserService) { }

    @Get() //metodo da função 
    findAll() {
        return this.userService.findAll()
    }

    @Get(":id")
    findOneUser(@Param("id") id: string) {
        return this.userService.findOne(parseInt(id))
    }

    @Post()
    create(@Body() user: {name:string, email:string}) {
       return this.userService.create(user)
    }

    @Put(":id")
    update(@Param("id") id:string,@Body() user: {name:string, email:string}){
        return this.userService.update(parseInt(id),user)
    }


}