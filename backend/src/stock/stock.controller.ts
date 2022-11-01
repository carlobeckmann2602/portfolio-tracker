import {Controller, Delete, Get, Post, Put} from '@nestjs/common'
import { ApiProperty, ApiTags } from '@nestjs/swagger'
import { StockService } from './stock.service'

@Controller('stock')
@ApiTags('stock')
export class StockController {
    constructor(private readonly stockService: StockService) {}
    
    @Post(':id')
    createStock() : any {
        return null
    }

    @Get()
    getStock() : any {
        return null
    }

    @Delete(':id')
    deleteUser() : any {
        return null
    }
}