import { Controller, Get, Param, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('stocks')
@Controller('stocks')
export class StockController {
  mockMode = true;
  mockStock = {
    id: 1,
    symbol: 'ADS',
    name: 'Adidas',
    open: '12.0',
    close: '22.1',
    high: '20.2',
    low: '10.1',
    description: 'Sportartikel',
    time: '2022-10-11T14:37:10.000Z',
  };

  constructor(private readonly stockService: StockService) {}

  @Get()
  @ApiOperation({ summary: 'Returns all stocks that contain the given (sub)string in their name' })
  @ApiResponse({ status: 200, description: 'Returns all found stocks as an array of json-objects' })
  async findAll(@Query('name') stockName: string) {
    return this.stockService.searchStocks(stockName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns information about a specific stock' })
  @ApiResponse({ status: 200, description: 'Returns a json-object containing all information about the stock with the sid' })
  @ApiResponse({ status: 400, description: 'There was no stock with the given sid. No stock-object is returned' })
  findOne(@Param('id') id: number) {
    if (this.mockMode) {
      return this.mockStock;
    }
    return this.stockService.findOne(+id);
  }
}
