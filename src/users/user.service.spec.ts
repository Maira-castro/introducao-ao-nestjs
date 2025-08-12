import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";

// * mock simulação do banco de dados(prisma), não chama o banco, simula um.
// ! nome com métodos do prisma

const mockPrisma = {
    user: { //* tabela com o nome user
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(), //this.prisma.place.findUnique
        update: jest.fn(),
        delete: jest.fn(),
    }
}

//* Testes para o UsersService
// Aqui estamos criando uma suite de testes(describe) para o UsersService, que é responsável por gerenciar usuários
// Usamos o Jest para criar mocks e verificar se as funções estão sendo chamadas corretamente
describe("UsersService", () => {
    let service: UsersService; //usersSerice é real, instancia do nosso arquivo

    // se repete antes de cada teste, criamos uma instância do UsersService com o PrismaService mockado(simulado)
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService, //instancia real
                //quando o userService pedir isso             //vai entregar isso
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    // *Testes individuais
    // Aqui definimos os testes individuais para cada funcionalidade do UsersService

    // * 01. Teste do método UserService.create
    it("deve criar um usuário", async () => {
        const userDataDto = { name: "Jonas", email: "jonas@example.com", password: "senha123" };
        mockPrisma.user.create.mockResolvedValue(userDataDto);

        const result = await service.create(userDataDto as any);
        expect(result).toEqual(userDataDto);
        expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: userDataDto });
    });

    // *02. Teste para o método UserService.findAll
    it("deve retornar todos os usuario", async () => {
        const listUser = [
        { name: "Jonas", email: "jonas@example.com", role: "TURISTA" },
        { name: "Valdiano", email: "valdiano@example.com", role: "TURISTA" }
    ];
        mockPrisma.user.findMany.mockResolvedValue(listUser); //isso é o que to recebendo

        const result = await service.findAll() //isso é o que to retornando
        expect(result).toEqual(listUser)
    })

    // * 03. Teste para o método UserService.findUnique

    it("deve retornar um usuario pelo id", async () => {
        const user = { id: 'dsdsfsfsf', name: "Jonas", email: "jonas@example.com", password: "senha123" }
        mockPrisma.user.findUnique.mockResolvedValue(user);

        const result = await service.findOne(user.id)
        expect(result).toEqual(user)
        expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: user.id } });
    })

    //* 04.Teste para o método userservice.update
    it("deve atualizar um usuario pelo id", async () => {
        const userId = 'dsdsfsfsf';
        const updateData = {
            name: "Jonas",
            email: "jonas@example.com",
            password: "senha123"
        };
        const updatedUser = { id: userId, ...updateData };
        mockPrisma.user.update.mockResolvedValue(updatedUser);
        const result = await service.update(userId, updateData);

        expect(result).toEqual(updatedUser);
        expect(mockPrisma.user.update).toHaveBeenCalledWith({
            where: { id: userId },
            data: updateData
        });

    })

    //* 05.Teste para o método userservice.delete
    it("deve deletar um usuario pelo id", async () => {
        const user = { id: 'dsdsfsfsf', name: "Jonas", email: "jonas@example.com", password: "senha123" }
        mockPrisma.user.delete.mockResolvedValue(user);

        const result = await service.remove(user.id)
        expect(result).toEqual(user)
        expect(mockPrisma.user.delete).toHaveBeenCalledWith({ where: { id: user.id } });
    })
});

//! Executar os  testes: npm test