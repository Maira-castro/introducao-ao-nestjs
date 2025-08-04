import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsPositive, Max, MaxLength } from "class-validator"

export class PaginatedDto {
    @IsNumber()
    @IsOptional()
    @Max(50)
    @Type(() => Number)
    @IsPositive({message:'numero deve ser positivo'})
    limit: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @IsPositive({message:'numero deve ser positivo'})
    page: number
}