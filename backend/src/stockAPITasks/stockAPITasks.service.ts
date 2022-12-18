import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Stock, StockHistory } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiFunctions } from './ApiFunctions';

@Injectable()
export class StockAPITasksService {
  private readonly logger = new Logger(StockAPITasksService.name);

  constructor(private prisma: PrismaService) {}

  @Cron('0 0-5 8 * * *')
  handleCron() {
    this.logger.debug('Started Cron-Task');
    this.updateStocks();
  }

  async updateStocks() {
    const stocks = await this.prisma.stock.findMany();

    stocks.forEach(currentStock => {
      this.insertUpdatedStock(currentStock, this.requestStockAPI(currentStock.symbol));
    });
  }

  async requestStockAPI(stock: String) {
    const axios = require('axios');
    const params = {
      apikey: '6Q89Q5LYA6SHDOCL',
    };
    const baseURL: String = 'https://www.alphavantage.co/query';
    const stockSymbol: String = stock;
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

        const timeseriesstring = Object.keys(apiResponse)[1];
        this.logger.debug("timeseries:" + timeseriesstring);

        const datekey = Object.keys(apiResponse[timeseriesstring])[0];
        this.logger.debug("datekey:" + datekey);

        const all = apiResponse[timeseriesstring][datekey];
        this.logger.debug("gesamt:" + all["2. high"]);
        return all;
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
