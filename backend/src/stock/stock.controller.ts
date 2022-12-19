import { Controller, Get, Param, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StockAPITasksService } from 'src/stockAPITasks/stockAPITasks.service';
import { ApiFunctions } from 'src/stockAPITasks/ApiFunctions';
@ApiTags('stocks')
@Controller('stocks')
export class StockController {
  mockMode = false;
  mockStocks = [
    {
      id: 0,
      symbol: 'ADS',
      name: 'Adidas',
      open: '137.5000',
      close: '175.4600',
      high: '184.2000',
      low: '132.1000',
      trend: '-0.42',
      description:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
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
      trend: '+1.98',
      description:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      time: '2022-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      symbol: 'EXA',
      name: 'Example',
      open: '135.6000',
      close: '147.9000',
      high: '173.2000',
      low: '120.5000',
      trend: '+3.65',
      description:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      time: '2022-01-01T00:00:00.000Z',
    },
    {
      id: 3,
      symbol: 'DPD',
      name: 'DPD',
      open: '235.5000',
      close: '211.9000',
      high: '240.2000',
      low: '180.5000',
      trend: '-4.76',
      description:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      time: '2022-01-01T00:00:00.000Z',
    },
    {
      id: 4,
      symbol: 'AAPL',
      name: 'Apple',
      open: '566.5000',
      close: '600.9000',
      high: '612.2000',
      low: '566.5000',
      trend: '+0.89',
      description:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      time: '2022-01-01T00:00:00.000Z',
    },
    {
      id: 5,
      symbol: 'TEL',
      name: 'Telekom',
      open: '28.5600',
      close: '34.9000',
      high: '55.2000',
      low: '25.5000',
      trend: '-5.20',
      description:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      time: '2022-01-01T00:00:00.000Z',
    },
    {
      id: 6,
      symbol: 'BASF',
      name: 'BASF',
      open: '175.5600',
      close: '176.9000',
      high: '178.2000',
      low: '170.5000',
      trend: '-0.89',
      description:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      time: '2022-01-01T00:00:00.000Z',
    },
    {
      id: 7,
      symbol: 'LH',
      name: 'Lufthansa',
      open: '270.5600',
      close: '279.9000',
      high: '285.2000',
      low: '234.5000',
      trend: '+0.00',
      description:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      time: '2022-01-01T00:00:00.000Z',
    },
    {
      id: 8,
      symbol: 'IBM',
      name: 'IBM',
      open: '125.0000',
      close: '122.1000',
      high: '127.2000',
      low: '122.3000',
      trend: '-12.00',
      description:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      time: '2022-10-11T14:37:10.000Z',
    },
  ];

  constructor(private readonly stockService: StockService, private readonly taskService: StockAPITasksService) {}

  // ----------------------------------------- //
  // ONLY FOR TESTING PURPOSES, DELETE LATER   //
  // ----------------------------------------- //
  @Get('/test/:name')
  async testAPI(@Param('name') stockName: string) {
    // const testResponse = await this.taskService.requestStockAPI(stockName, ApiFunctions.AV_DAILY);
    // const testResponse = this.taskService.insertUpdatedStock(
    //   0,
    //   await this.taskService.requestStockAPI('AAPL', ApiFunctions.AV_DAILY),
    // );
    this.taskService.addDailyStockEntries();
    return '';
  }
  // ----------------------------------------- //
  // ONLY FOR TESTING PURPOSES, DELETE LATER   //
  // ----------------------------------------- //

  @Get()
  @ApiOperation({ summary: 'Returns all stocks that contain the given (sub)string in their name or symbol' })
  @ApiResponse({ status: 200, description: 'Returns all found stocks as an array of json-objects' })
  async findAll(@Query('name') stockName: string) {
    if (this.mockMode) {
      return this.mockStocks;
    }
    return this.stockService.searchStocks(stockName); // !!!! Sec issue !!! we have to make sure that the query string is not malicious code -> in string casten
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns information about a specific stock' })
  @ApiResponse({ status: 200, description: 'Returns a json-object containing all information about the stock with the sid' })
  @ApiResponse({ status: 400, description: 'There was no stock with the given sid. No stock-object is returned' })
  findOne(@Param('id') id: number) {
    if (this.mockMode) {
      if (id >= 0 && id < 8) {
        return this.mockStocks[id];
      } else {
        return [];
      }
    }
    return this.stockService.findOne(+id);
  }
}
