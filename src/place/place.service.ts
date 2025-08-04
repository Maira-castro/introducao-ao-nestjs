import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from './types/cloudinary.service';
import { ImageObject } from './types/image-object';
import { Place } from '@prisma/client';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Injectable()
export class PlaceService {
  constructor(private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) { }

  async findAll() {
    return this.prisma.place.findMany()
  }

  //RETORNAR PAGINAS COM PAGINAÇÃO
  async findPaginated(page, limit) {
    const [places, total] = await this.prisma.$transaction([ //quando queremos fazer mais de uma consulta

      this.prisma.place.findMany({ //resultado vai ser armazenado em places
        skip: (page - 1) * limit, //razão(de quanto em quanto)
        take: limit,  //quantos      
        orderBy: { created_at: 'desc' }
      }),
      this.prisma.place.count() //quantos itens tem cadastrado na tabela //resultado vai ser armazenado em total
    ])
    return {
      data: places,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    }
  }

  async create(data: {
    name: string,
    type: any,
    latitude: number,
    longitude: number,
    phone: string,
    images: ImageObject[]
  }) {
    return this.prisma.place.create({ data })
  }

  async update(id: string, newData: UpdatePlaceDto, newImagens?: Buffer[]): Promise<Place> {
    //busca o place no banco de dados
    const place = await this.prisma.place.findUnique({ where: { id } })
    //se não achar o lugar
    if (!place) throw new BadRequestException("Local não encontrado!")
    //se forem enviadas novas imagens:
    let images = place.images as ImageObject[]

    //verfica se tem imagens para serem cadastradas e verifica se esta vindo novas imagens
    if (newImagens && newImagens.length > 0) {
      //deleta as imgens que já tem cadastradas no cloudinary
      await Promise.all(images.map(img =>
        this.cloudinaryService.deleteImage(img.public_id)
      ))
      //upload de novas imagens a serem atualizadas
      images = await Promise.all(
        newImagens.map(newImg =>
          this.cloudinaryService.uploadImage(newImg)
        )
      )
    }
    return this.prisma.place.update({
      where: { id },
      data: {
        ...newData,
        ...(newImagens ?
          { imagens: JSON.parse(JSON.stringify(images)) } : {})
      }
    })
  }

  async delete(id: string): Promise<void> {
    const place = await this.prisma.place.findUnique({ where: { id } })

    if (!place) throw new BadRequestException('Local não encontrado!')
    const images = place.images as ImageObject[]
    //apago as imagens do Cloudinary
    await Promise.all(images.map(
      (image) => this.cloudinaryService.deleteImage(image.public_id)))
    //apago o registro de place do banco de dados
    await this.prisma.place.delete({ where: { id } })
  }
}