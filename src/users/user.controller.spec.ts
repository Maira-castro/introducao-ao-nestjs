import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";


const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
}

describe("User Controller Tests", () => {
    let controller: UsersController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                { provide: UsersService, useValue: mockUserService }
            ]
        }).compile()

        controller = module.get<UsersController>(UsersController)
    })


    //* deve retornar todos os usuarios
    it("deve listar todos os usuarios", async () => {
        const users = [
            { name: "Jonas", email: "jonas@example.com" },
            { name: "Valdiano", email: "valdiano@example.com" }
        ]
        mockUserService.findAll.mockResolvedValue(users)//recebe de volta o proprio usuario criado

        const result = await mockUserService.findAll()
        expect(result).toEqual(users)
    })

    //* deve retornar um usuario pelo ID
    it("deve retornar um usuario pelo ID", async () => {
        const users = { id: "23ffdrg3", name: "Jonas", email: "jonas@example.com" }

        mockUserService.findOne.mockResolvedValue(users)

        const result = await controller.findOne(users.id)
        expect(result).toEqual(users)
        expect(mockUserService.findOne).toHaveBeenCalledWith(users.id)

    })

    //* Deve atualizar um usuario
    it("deve atualizar um usuario", async () => {
        const updateData = { id: "23ffdrg3", name: "Jonas", email: "jonas@example.com" }

        mockUserService.update.mockResolvedValue(updateData)

        const result = await controller.update(updateData.id, updateData)
        expect(result).toEqual(updateData)
        expect(mockUserService.update).toHaveBeenCalledWith(updateData.id, updateData)
    })

    //* deve deletar um usuario
    it("deve deletar um usuario", async () => {
        const user = { id: "23ffdrg3", name: "Jonas", email: "jonas@example.com" }
        mockUserService.remove.mockResolvedValue(user)

        const result = await controller.remove(user.id)
        expect(result).toEqual(user)
        expect(mockUserService.remove).toHaveBeenCalledWith(user.id)
    })

})
