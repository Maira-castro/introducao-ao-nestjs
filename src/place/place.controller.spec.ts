import { Test, TestingModule } from "@nestjs/testing";
import { PlaceController } from "./place.controller";
import { PlaceService } from "./place.service";
import { Place, placeType } from "@prisma/client";
import { CloudinaryService } from "./types/cloudinary.service";
import { BadRequestException } from "@nestjs/common";
import { PaginatedDto } from "./dto/paginated-place.dto";
import { UpdatePlaceDto } from "./dto/update-place.dto";

// Dados de mock (simulados) para usar nos testes
const data: Place[] = [{
    id: '1',
    name: "Sunset",
    phone: "40028922",
    type: placeType.BAR,
    latitude: -13332.132,
    longitude: -44755.75,
    created_at: new Date(),
    images: [{ url: "http://dfjdjswey23454", url_public: "http://dfjdjswey4354" }]
}, {
    id: '2',
    name: "Lunar",
    phone: "40028922",
    type: placeType.HOTEL,
    latitude: -13332.132,
    longitude: -44755.75,
    created_at: new Date(),
    images: [{ url: "http://dfjdjswey23457", url_public: "http://dfjdjswey4353" }]
}]


// Bloco de testes para o PlaceController
describe("PlaceController testes", () => {

    let controller: PlaceController;
    // Variáveis para os serviços mock (simulados)
    let placeService: jest.Mocked<PlaceService>;
    let cloudinaryService: jest.Mocked<CloudinaryService>;

    // Este bloco é executado antes de CADA teste
    beforeEach(async () => {
        // Mock (simulação) do PlaceService. 
        // Cada método é substituído por uma função vazia controlada pelo Jest.
        const mockPlaceService = {
            findAll: jest.fn(),
            findPaginated: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
        }

        // Mock (simulação) do CloudinaryService
        const mockCloudinaryService = {
            uploadImage: jest.fn()
        }

        // Criação de um módulo de teste. Isso permite injetar os mocks
        // no controlador, simulando o ambiente de produção.
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PlaceController],
            providers: [
                // Fornece a simulação (mock) do PlaceService
                { provide: PlaceService, useValue: mockPlaceService },
                // Fornece a simulação (mock) do CloudinaryService
                { provide: CloudinaryService, useValue: mockCloudinaryService }
            ]
        }).compile()

        // Obtém a instância do controlador e dos serviços mock
        controller = module.get<PlaceController>(PlaceController);
        placeService = module.get(PlaceService);
        cloudinaryService = module.get(CloudinaryService);
    });


    // Teste 1: deve listar todos os locais
    it("deve listar todos os locais", async () => {

        // Configura o mock: quando `findAll` for chamado, ele resolverá para os dados de mock.
        placeService.findAll.mockResolvedValue(data)

        // Chama o método do controlador e verifica se o resultado é igual aos dados de mock.
        expect(await controller.findAll()).toEqual(data)
        // Verifica se o método `findAll` do serviço mock foi chamado.
        expect(placeService.findAll).toHaveBeenCalledWith()
    })

    // Teste 2: deve deletar um local pelo ID
    it("deve deletar um local", async () => {

        // Configura o mock para retornar o primeiro item dos dados.
        placeService.delete.mockResolvedValue(data[0])
        // Chama o método do controlador e verifica o retorno.
        expect(await controller.deletePlace(data[0].id)).toEqual(data[0])
        // Verifica se o método `delete` foi chamado com o ID correto.
        expect(placeService.delete).toHaveBeenCalledWith(data[0].id)

    })

    // Teste 3: deve retornar um local pelo ID
    it("deve retornar um local pelo ID", async () => {

        // Configura o mock para retornar o primeiro item dos dados.
        placeService.findOne.mockResolvedValue(data[0])

        // Chama o método do controlador e verifica o retorno.
        expect(await controller.findOne(data[0].id)).toEqual(data[0])
        // Verifica se o método `findOne` foi chamado com o ID correto.
        expect(placeService.findOne).toHaveBeenCalledWith(data[0].id)

    })

    // Teste 4: deve criar um local
    it("deve criar um local com images", async () => {

        // Dados de entrada (DTO) e arquivos de imagem para o teste.
        const dto = {
            name: "Sunset",
            phone: "40028922",
            type: placeType.BAR,
            latitude: -13332.132,
            longitude: -44755.75,
        }

        const files = { images: [{ buffer: Buffer.from('fake-image-1') }] } as any

        // Configura o mock do Cloudinary: quando `uploadImage` for chamado, 
        // ele simulará um upload bem-sucedido.
        cloudinaryService.uploadImage.mockResolvedValue({ url: "https://", public_id: "id_from_cloudinary" })

        // Configura o mock do PlaceService: quando `create` for chamado, 
        // ele simulará a criação do local no banco de dados.
        placeService.create.mockResolvedValue({
            id: "4", images: [{ url: "https://", public_id: "id_from_cloudinary" }], created_at: new Date(), ...dto
        })

        // Chama o método de criação do controlador.
        const result = await controller.create(dto as any, files)

        // Verifica se os métodos dos serviços foram chamados.
        expect(cloudinaryService.uploadImage).toHaveBeenCalled()
        expect(placeService.create).toHaveBeenCalled()
        // Verifica se o resultado tem o ID esperado.
        expect(result.id).toBe("4")
    })


    // Teste 5: deve lançar erro ao criar sem images
    it("deve dar erro ao criar local sem images", async () => {
        const dto = {
            name: "Sunset",
            phone: "40028922",
            type: placeType.BAR,
            latitude: -13332.132,
            longitude: -44755.75,
        }

        const files = { images: [] } as any

        // `rejects.toThrow` é usado para verificar se uma Promise
        // é rejeitada (lança um erro) com uma exceção específica.
        await expect(controller.create(dto, files)).rejects.toThrow(BadRequestException)

    })

    // Teste 6: deve atualizar um local
    it('deve atualizar local', async () => {
        const updated: UpdatePlaceDto = { name: 'Novo' };
        const file = { images: [] }
        // Configura o mock para retornar o segundo item de mock.
        placeService.update.mockResolvedValue(data[1]);

        // Chama o método de atualização do controlador.
        const result = await controller.updatePlace(data[1].id, { name: 'Novo' }, file as any); 
        // Verifica se o resultado é o objeto atualizado esperado.
        expect(result).toEqual(data[1]);
        // Verifica se o método `update` do serviço foi chamado com os argumentos corretos.
        expect(placeService.update).toHaveBeenCalledWith(data[1].id, updated, file)
    });


    // Teste 7: deve retornar os locais paginados
    it("deve retornar os locais paginados", async () => {

        const dto: PaginatedDto = { page: 2, limit: 1 }

        // Objeto de retorno simulado para a paginação.
        const retorna = {
            data, meta: { total: 2, page: 2, lastPage: 2 }
        }

        // Configura o mock para simular o retorno paginado.
        placeService.findPaginated.mockResolvedValue(retorna)

        // Chama o método de paginação do controlador.
        const result = await controller.findPaginated(dto)
        // Verifica se o resultado é igual ao objeto de retorno simulado.
        expect(result).toEqual(retorna)
        // Verifica se o método do serviço foi chamado com os parâmetros de página e limite corretos.
        expect(placeService.findPaginated).toHaveBeenCalledWith(2, 1)
    })
})
