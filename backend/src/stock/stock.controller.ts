import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StockService } from './stock.service';
@ApiTags('stocks')
@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @ApiOperation({
    summary:
      'Returns stock company information and the latest stock exchange entry for each stock containing the given (sub)string in their name or symbol',
  })
  @ApiResponse({ status: 200, description: 'Returns detailed stock company information for each search result' })
  @ApiResponse({ status: 404, description: 'There were no stocks with the given (sub)string. No stock-objects are returned' })
  async findAll(@Query('name') stockName: string) {
    return this.stockService.searchStocks(stockName); // !!!! Sec issue !!! we have to make sure that the query string is not malicious code -> in string casten
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Returns the stock company information and the latest stock exchange entry for the stock with the given sid',
  })
  @ApiResponse({ status: 200, description: 'Returns the information about the stock (company) with the sid' })
  @ApiResponse({ status: 404, description: 'There was no stock with the given sid. No stock-object is returned' })
  findOne(@Param('id') id: string) {
    return this.stockService.getStockWithHistory(id);
  }
}
