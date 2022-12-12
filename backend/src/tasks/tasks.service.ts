import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Stock } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiFunctions } from './ApiFunctions';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private prisma: PrismaService) {}

  @Cron('0 0 8 * * *')
  handleCron() {
    this.logger.debug('Started Cron-Task');
    this.updateStocks();
  }

  async updateStocks() {
    const stocks = await this.prisma.stock.findMany();

    stocks.forEach(currentStock => {
      this.insertUpdatedStock(currentStock, this.requestStockAPI(currentStock));
    });
  }

  async requestStockAPI(stock: Stock) {
    const axios = require('axios');
    const params = {
      apikey: '6Q89Q5LYA6SHDOCL',
    };
    const baseURL: String = 'https://www.alphavantage.co/query';
    const stockSymbol: String = stock.symbol;
    const apiFunction: String = ApiFunctions.AV_DAILY;
    const requestURL: String  = `${baseURL}`
                                + `?${apiFunction}`
                                + `&symbol=${stockSymbol}`
                                + `&outputsize=compact`;

    this.logger.debug(`Request Stock-API by the URL: ${requestURL}`);

    const stockValues = await axios
      .get(requestURL, { params: params })
      .then((response) => {
        const apiResponse = response.data;
        // TODO: Change hardcoded date to first date (maybe use sth. like 'apiResponse[Object.keys(apiResponse)[1]]'?)
        return apiResponse['Time Series (Daily)']['2022-12-09'];
      })
      .catch((error) => {
        console.log(error);
      });

    return stockValues;
  }

  insertUpdatedStock(oldStock: Stock, stockData: Object) {
    // WIP
    return;
  }
}
