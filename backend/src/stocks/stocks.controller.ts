import { Controller, Get, Param, Query } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('stocks')
@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get('?search')
  @ApiOperation({ summary: 'Returns all stocks that contain the given (sub)string in their name' })
  @ApiResponse({ status: 200, description: 'Returns all found stocks as a stream of json-objects' })
  @ApiResponse({ status: 400, description: 'There was a fatal error fetching the stocks' })
  findAll(@Query('search') stockname: string) {
    return this.stocksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns information about a specific stock' })
  @ApiResponse({ status: 200, description: 'Returns a json-object containing all information about the stock with the sid' })
  @ApiResponse({ status: 400, description: 'There was no stock with the given sid. No stock-object is returned' })
  findOne(@Param('id') id: string) {
    return this.stocksService.findOne(+id);
  }
}
