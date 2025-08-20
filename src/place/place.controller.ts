import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, BadRequestException, UseInterceptors, UploadedFiles, Put, Query } from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { File as MulterFile } from 'multer'
import { CloudinaryService } from './types/cloudinary.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PaginatedDto } from './dto/paginated-place.dto';

@Controller('place')
export class PlaceController {
  constructor(private readonly placeService: PlaceService,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 3 }]))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cadastrar um novo local' })
  @ApiResponse({ status: 201, description: 'Place criado com sucesso!' })
  @ApiBody({
    description: 'formulário criação de local',
    schema: {
      type: 'object',
      required: ['name', 'type', 'phone', 'latitude', 'longitude', 'images'],
      properties: {
        name: { type: 'string', example: 'Praça Central' },
        type: { type: 'string', enum: ['RESTAURANTE', 'BAR', 'HOTEL'] },
        phone: { type: 'string', example: '(88)9 9999999' },
        latitude: { type: 'number', example: -3.7327 },
        longitude: { type: 'number', example: -38.5267 },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Máximo de 3 imagens',
        },
      },
    },
  })
  async create(
    @Body() data: CreatePlaceDto,
    @UploadedFiles() files: { images?: MulterFile[] }) {
    if (!files.images || files.images.length === 0) {
      throw new BadRequestException('Pelo menos uma foto precisa ser enviada')
    }
    const imagensUrl = await Promise.all(
      files.images.map(
        (file) => this.cloudinaryService.uploadImage(file.buffer)
      )
    )
    return this.placeService.create({
      ...data,
      images: imagensUrl
    })
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todos os locais' })
  async findAll() {
    return this.placeService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string){
    return this.placeService.findOne(id)
  }

  @Put(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 3 }]))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Atualizar local com ou sem novas imagens' })
  @ApiBody({
    description: 'Formulário com dados opcionais do local a serem atualizados. Se enviar imagens, elas substituirão as anteriores.',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Novo nome da Praça' },
        type: { type: 'string', enum: ['RESTAURANTE', 'BAR', 'HOTEL'], example: 'RESTAURANTE' },
        phone: { type: 'string', example: '(85) 91234-5678' },
        latitude: { type: 'number', example: -3.7325 },
        longitude: { type: 'number', example: -38.5259 },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Novas imagens que substituirão as anteriores (máximo de 3)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Place atualizado com sucesso' })
  async updatePlace(@Param('id') id: string, @Body() data: UpdatePlaceDto, @UploadedFile() files: { images?: MulterFile[] }) {
    const newImagens = files.images?.map(img => img.buffer)
    return this.placeService.update(id, data, newImagens)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'deletar local e suas imagens no Cloudinary' })
  @ApiResponse({ status: 200, description: 'Local deletado com sucesso.' })
  async deletePlace(@Param('id') id: string) {
    return this.placeService.delete(id)
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Listar locais paginados' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findPaginated(@Query() paginatedDto:PaginatedDto) {
    return this.placeService.findPaginated(paginatedDto.page, paginatedDto.limit)
  }
}

