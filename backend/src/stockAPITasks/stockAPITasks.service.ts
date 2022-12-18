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
    this.addDailyStockEntries();
  }

  async addDailyStockEntries() {
    const stocks = await this.prisma.stock.findMany();

    for (const currentStock of stocks) {
      const updatedStock = await this.requestStockAPI(currentStock.symbol, ApiFunctions.AV_DAILY);
      this.insertUpdatedStock(currentStock.id, updatedStock);
    }
  }

  async requestStockAPI(stockSymbol: String, apiFunction: ApiFunctions) {
    const axios = require('axios');
    const params = {
      apikey: '6Q89Q5LYA6SHDOCL',
    };
    const baseURL: String = 'https://www.alphavantage.co/query';
    const requestURL: String = `${baseURL}` + `?${apiFunction}` + `&symbol=${stockSymbol}` + `&outputsize=compact`;

    this.logger.debug(`Request Stock-API with the URL: ${requestURL}`);

    const stockValues = await axios
      .get(requestURL, { params: params })
      .then((response) => {
        const apiResponse = response.data;

        if (apiFunction === ApiFunctions.AV_COMPANYDETAILS) {
          if (JSON.stringify(apiResponse).startsWith('{"Symbol":')) {
            this.logger.debug('Received valid API-response for stock-company overview.');
          } else {
            this.logger.debug('Received unexpected API-response (format).');
          }

          return apiResponse;
        } else if (apiFunction === ApiFunctions.AV_DAILY) {
          if (JSON.stringify(apiResponse).startsWith('{"Meta Data":')) {
            this.logger.debug('Received valid API-response for daily stockdata.');
          } else {
            this.logger.debug('Received unexpected API-response (format).');
          }

          return apiResponse;
        } else {
          this.logger.debug('Requested function is not supported by backend.');
          return null;
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return stockValues;
  }

  async insertUpdatedStock(stockId: number, stockData: Object) {
    const timeseriesString = Object.keys(stockData)[1];
    this.logger.debug('timeseries:' + timeseriesString);

    const dateKey = Object.keys(stockData[timeseriesString])[0];
    this.logger.debug('datekey:' + dateKey);

    const newestEntry = stockData[timeseriesString][dateKey];
    this.logger.debug('gesamt:' + newestEntry['2. high']);

    await this.prisma.stockHistory.create({
      data: {
        split: +newestEntry['8. split coefficient'],
        open: +newestEntry['1. open'],
        close: +newestEntry['4. close'],
        high: +newestEntry['2. high'],
        low: +newestEntry['3. low'],
        trend: -2.0,
        time: new Date(dateKey),
        stock: { connect: { id: stockId } },
      },
    });

    return newestEntry;
  }
}
