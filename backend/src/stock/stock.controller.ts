import { Controller, Get, Param, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('stocks')
@Controller('stocks')
export class StockController {
  mockMode = true;
  mockStocks = [
    {
      id: 0,
      symbol: 'ADS',
      name: 'Adidas',
      open: '137.5000',
      close: '175.4600',
      high: '184.2000',
      low: '132.1000',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      time: '2022-10-11T14:37:10.000Z',
    },
    {
      id: 1,
      symbol: 'CON',
      name: 'Continental',
      open: '54.5000',
      close: '83.9000',
      high: '156.2000',
      low: '54.5000',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      time: '2022-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      symbol: 'IBM',
      name: 'IBM',
      open: '125.0000',
      close: '122.1000',
      high: '127.2000',
      low: '122.3000',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      time: '2022-10-11T14:37:10.000Z',
    }];

  constructor(private readonly stockService: StockService) {}

  @Get()
  @ApiOperation({ summary: 'Returns all stocks that contain the given (sub)string in their name' })
  @ApiResponse({ status: 200, description: 'Returns all found stocks as an array of json-objects' })
  async findAll(@Query('name') stockName: string) {
    if (this.mockMode) {
      return this.mockStocks;
    }
    return this.stockService.searchStocks(stockName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns information about a specific stock' })
  @ApiResponse({ status: 200, description: 'Returns a json-object containing all information about the stock with the sid' })
  @ApiResponse({ status: 400, description: 'There was no stock with the given sid. No stock-object is returned' })
  findOne(@Param('id') id: number) {
    if (this.mockMode) {
      if(id >= 0 && id < 3) {
          return this.mockStocks[id];
      }
      else {
          return this.mockStocks[0]; //TODO: Return error code instead of default object
      }
    }
    return this.stockService.findOne(+id);
  }
}
