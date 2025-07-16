//nao valida imagem no dto
import { ApiProperty } from "@nestjs/swagger"
import { placeType } from "@prisma/client"
import { Type } from "class-transformer"
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreatePlaceDto {
  @ApiProperty({example:'Bom de Prato'})
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({example:'RESTAURANTE, HOTEL OU BAR'})
  @IsEnum(placeType)
  type: placeType

  @ApiProperty({example:'(88)9 9999999'})
  @IsString()
  phone: string

  @ApiProperty({example:-3.7321})
  @Type(()=> Number)
  @IsNumber()
  latitude: number

  @ApiProperty({example:-3.7321})
  @Type(()=> Number)
  @IsNumber()
  longitude: number
}
