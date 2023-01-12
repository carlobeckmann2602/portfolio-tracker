import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiFunctions } from './ApiFunctions';

@Injectable()
export class StockAPITasksService {
  private readonly logger = new Logger(StockAPITasksService.name);

  constructor(private prisma: PrismaService) {}

  // Hardcoded stocks (i.e. their symbols) which are used to fill the DB

  //German DAX (XETRA) stocks (as from 19.12.2022)
  // !!! Company overviews does not work with given symbols in stock-API alpha vantage !!! //
  // public stockSymbols: String[] = [
  //   'IBM', //	Adidas
  //   'AIR.DEX', //	Airbus
  //   'ALV.DEX', //	Allianz
  //   'BAS.DEX', //	BASF
  //   'BAYN.DEX', // Bayer
  //   'BEI.DEX', //	Beiersdorf
  //   'BMW.DEX', //	BMW
  //   'BNR.DEX', //	Brenntag
  //   'CON.DEX', //	Continental
  //   '1COV.DEX', // Covestro
  //   'DTG.DEX', //	Daimler Truck
  //   'DBK.DEX', //	Deutsche Bank
  //   'DB1.DEX', //	Deutsche Börse
  //   'DPW.DEX', //	Deutsche Post
  //   'DTE.DEX', //	Deutsche Telekom
  //   'EOAN.DEX', // E.ON
  //   'FRE.DEX', //	Fresenius
  //   'FME.DEX', //	Fresenius Medical Care
  //   'HNR1.DEX', // Hannover Rück
  //   'HEI.DEX', //	HeidelbergCement (Heidelberg Materials)
  //   'HEN3.DEX', // Henkel
  //   'IFX.DEX', //	Infineon
  //   'LIN.DEX', //	Linde
  //   'MBG.DEX', //	Mercedes-Benz Group
  //   'MRK.DEX', //	Merck
  //   'MTX.DEX', //	MTU Aero Engines
  //   'MUV2.DEX', // Münchener Rück
  //   'PAG911.DEX', // Porsche AG
  //   'PAH3.DEX', // Porsche SE
  //   'QIA.DEX', //	Qiagen
  //   'RWE.DEX', //	RWE
  //   'SAP.DEX', //	SAP
  //   'SRT3.DEX', // Sartorius
  //   'SIE.DEX', //	Siemens
  //   'ENR.DEX', //	Siemens Energy
  //   'SHL.DEX', //	Siemens Healthineers
  //   'SY1.DEX', //	Symrise
  //   'VOW3.DEX', // Volkswagen
  //   'VNA.DEX', //	Vonovia
  //   'ZAL.DEX', //	Zalando
  // ];

  // First 40 companies on American NASDAQ 100 (as from 19.12.2022)
  public stockSymbols: string[] = [
    'MSFT', //	Microsoft Corp
    'AAPL', //	Apple Inc
    'AMZN', //	Amazon.com Inc
    'GOOG', //	Alphabet Inc
    'GOOGL', //	Alphabet Inc
    'NVDA', //	NVIDIA Corp
    'TSLA', //	Tesla Inc
    'META', //	Meta Platforms Inc
    'PEP', // PepsiCo Inc
    'AVGO', //	Broadcom Inc
    'COST', //	Costco Wholesale Corp
    'CSCO', //	Cisco Systems Inc
    'TMUS', //	T-Mobile US Inc
    'ADBE', //	Adobe Inc
    'TXN', // Texas Instruments Inc
    'CMCSA', //	Comcast Corp
    'AMGN', //	Amgen Inc
    'HON', // Honeywell International Inc
    'NFLX', //	Netflix Inc
    'QCOM', //	QUALCOMM Inc
    'SBUX', //	Starbucks Corp
    'INTC', //	Intel Corp
    'GILD', //	Gilead Sciences Inc
    'INTU', //	Intuit Inc
    'AMD', // Advanced Micro Devices Inc
    'ADP', // Automatic Data Processing Inc
    'ISRG', //	Intuitive Surgical Inc
    'MDLZ', //	Mondelez International Inc
    'AMAT', //	Applied Materials Inc
    'ADI', // Analog Devices Inc
    'PYPL', //	PayPal Holdings Inc
    'VRTX', //	Vertex Pharmaceuticals Inc
    'REGN', //	Regeneron Pharmaceuticals Inc
    'BKNG', //	Booking Holdings Inc
    'MRNA', //	Moderna Inc
    'CSX', // CSX Corp
    'FISV', //	Fiserv Inc
    'LRCX', //	Lam Research Corp
    'ATVI', //	Activision Blizzard Inc
    'MU', // Micron Technology Inc
  ];

  /**
   * Helper-function to implement a sleep-functionality needed for restricted amount of stock-API requests
   */
  sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /**
   * Requests new stockvalues for every entry within the 'Stock'-Table at 8 am and saves the responses in the 'StockHistory'-Table.
   */
  @Cron('0 0 8 * * *')
  async dailyStockUpdateCron() {
    this.logger.debug('----------------------------------------------------');
    this.logger.debug('Started Cron-Task: DAILY STOCK UPDATE');
    this.logger.debug('----------------------------------------------------');

    // Get all stocks which have to be updated
    const stocks = await this.prisma.stock.findMany();

    // Keep track of count of stock-API requests: max. 5 calls per minute are possible
    let requestCount = 0;
    for (const currentStock of stocks) {
      // If 5 calls were made (within a minute): Wait a minute for new possible requests
      if (requestCount === 5) {
        this.logger.debug(`Start waiting for 60 seconds.`);
        await this.sleep(60000);
        this.logger.debug(`End waiting.`);
        requestCount = 0;
      }
      // Get most recent values for stock from stock-API
      const updatedStock = await this.requestStockAPI(currentStock.symbol, ApiFunctions.AV_DAILY, ApiFunctions.AV_OUTPUTCOMPACT);

      if (updatedStock == null) {
        this.logger.debug('An unexpected error occured while requesting data from stock-API.');
      } else {
        // Save most recent entry for stockvalue in DB
        await this.insertUpdatedStock(currentStock.id, updatedStock);
      }
      requestCount++;
    }

    this.logger.debug('----------------------------------------------------');
    this.logger.debug('Finished Cron-Task: DAILY STOCK UPDATE');
    this.logger.debug('----------------------------------------------------');
  }

  /**
   * Inserts the most recent values of a given stock into the DB
   * @param stockID ID from 'Stock'-Table for the stock, which values should be updated
   * @param stockData Most recent stock-API response for stock with given ID
   */
  async insertUpdatedStock(stockID: number, stockData: Object) {
    // Extract inner object "Time Series (Daily)" from stock-API response object
    const timeseriesString = Object.keys(stockData)[1];

    // Extract first date object (format "2022-01-01") within "Time Series (Daily)" from stock-API response object
    const dateKey = Object.keys(stockData[timeseriesString])[0];
    const newestEntry = stockData[timeseriesString][dateKey];
    const createdStock = await this.persistStockData(stockID, newestEntry, dateKey);

    this.logger.debug(`Successfully created db entry for ${createdStock.stockId} for the date ${(await createdStock).time}.`);
  }

  /**
   * Checks if historic data for every entry within the 'Stock'-Table is complete in the 'StockHistory'-Table every day at 5 am. If the historic data seems to be incomplete, the (historic) stockdata is requested and compared to the saved data in the DB. If a entry is missing, it is added.
   */
  @Cron('0 0 5 * * *')
  async insertHistoricDataCron() {
    this.logger.debug('----------------------------------------------------');
    this.logger.debug('Started Cron-Task: INSERT HISTORIC STOCK DATA');
    this.logger.debug('----------------------------------------------------');

    // Get all stocks which are supposed to have historic data
    const stocks = await this.prisma.stock.findMany();

    // Keep track of count of stock-API requests: max. 5 calls per minute are possible
    let requestCount = 0;
    for (const currentStock of stocks) {
      const stockHistories = await this.prisma.stockHistory.findMany({
        where: { stockId: currentStock.id },
      });
      // If less than 5000 historic data points are present in DB, the data seems to be incomplete (as the stock-API provides more data points)
      if (stockHistories.length < 5000) {
        // If 5 calls were made (within a minute): Wait a minute for new possible requests
        if (requestCount === 5) {
          this.logger.debug(`Start waiting for 60 seconds.`);
          await this.sleep(60000);
          this.logger.debug(`End waiting.`);
          requestCount = 0;
        }

        const updatedStockHistory = await this.requestStockAPI(
          currentStock.symbol,
          ApiFunctions.AV_DAILY,
          ApiFunctions.AV_OUTPUTFULL,
        );

        if (updatedStockHistory == null) {
          this.logger.debug('An unexpected error occured while requesting data from stock-API.');
        } else {
          this.insertUpdatedHistory(currentStock.id, updatedStockHistory);
        }
        requestCount++;
      }
    }

    this.logger.debug('----------------------------------------------------');
    this.logger.debug('Finished Cron-Task: INSERT HISTORIC STOCK DATA');
    this.logger.debug('----------------------------------------------------');
  }

  /**
   * Inserts all historic datapoints of a given stock into the DB, if they are not already present
   * @param stockID ID from 'Stock'-Table for the stock, which values should be persisted
   * @param stockData Most recent stock-API response for stock with given ID and historic data
   */
  async insertUpdatedHistory(stockID: number, stockData: Object) {
    const timeseriesString = Object.keys(stockData)[1];

    // Iterate over every date in the given stockData (use reversed order to be able to compute trend, which needs a previous data point)
    for (const historyDateKey of Object.keys(stockData[timeseriesString]).reverse()) {
      const historyDateObject = stockData[timeseriesString][historyDateKey];

      //Search DB for possibly already persisted data point for the current date
      const currentHistoryData = await this.prisma.stockHistory.findFirst({
        where: {
          stockId: stockID,
          time: new Date(historyDateKey),
        },
      });

      // If null, the historic data point (with the current date) seems to be missing and will now be persisted
      if (currentHistoryData == null) {
        const persistedData = await this.persistStockData(stockID, historyDateObject, historyDateKey);

        this.logger.debug(
          `Successfully created DB entry for stock ${(await persistedData).stockId} on date ${(await persistedData).time}.`,
        );
      }
    }
  }

  /**
   * Requests information about the companies of every entry within the local class array at 3 am and updates the 'Stock'-Table, if necessary.
   */
  @Cron('0 0 3 * * *')
  async insertCompanyDataCron() {
    this.logger.debug('----------------------------------------------------');
    this.logger.debug('Started Cron-Task: INSERT STOCK COMPANY DATA');
    this.logger.debug('----------------------------------------------------');

    // Keep track of count of stock-API requests: max. 5 calls per minute are possible
    let requestCount = 0;
    for (const currentStock of this.stockSymbols) {
      // If 5 calls were made (within a minute): Wait a minute for new possible requests
      if (requestCount === 5) {
        this.logger.debug(`Start waiting for 60 seconds.`);
        await this.sleep(60000);
        this.logger.debug(`End waiting.`);
        requestCount = 0;
      }
      const companyInfo = await this.requestStockAPI(currentStock, ApiFunctions.AV_COMPANYDETAILS);

      if (companyInfo == null) {
        this.logger.debug('An unexpected error occured while requesting data from stock-API.');
      } else {
        await this.insertUpdatedCompanyInfos(companyInfo);
      }
      requestCount++;
    }

    this.logger.debug('----------------------------------------------------');
    this.logger.debug('Finished Cron-Task: INSERT STOCK COMPANY DATA');
    this.logger.debug('----------------------------------------------------');
  }

  /**
   * Inserts/updates the company details of a given stock into the 'Stock'-Table in the DB, if they are not already present
   * @param companyInfo Most recent stock-API response with information of company for a stock
   */
  async insertUpdatedCompanyInfos(companyInfo: Object) {
    const createdCompany = await this.prisma.stock.upsert({
      where: { symbol: companyInfo['Symbol'] },
      update: {
        name: companyInfo['Name'],
        description: companyInfo['Description'],
      },
      create: {
        symbol: companyInfo['Symbol'],
        name: companyInfo['Name'],
        description: companyInfo['Description'],
      },
    });

    this.logger.debug(
      `Created/updated entry with information for company-stock ${createdCompany.name} (${createdCompany.id}) with symbol ${createdCompany.symbol}.`,
    );
  }

  /**
   * Persists the given stockData in the 'StockHistory'-Table of the DB
   * @param stockID ID from 'Stock'-Table for the stock, which values should be persisted
   * @param stockData Most recent stock-API response for stock with given ID and historic data
   * @param dateKey Date of the given stockData
   * @returns Persisted DB-object
   */
  async persistStockData(stockID: number, stockData: Object, dateKey: string) {
    const trend = await this.computeTrend(stockID, stockData, dateKey);

    return await this.prisma.stockHistory.create({
      data: {
        split: +stockData['8. split coefficient'],
        open: +stockData['1. open'],
        close: +stockData['4. close'],
        high: +stockData['2. high'],
        low: +stockData['3. low'],
        trend: trend,
        time: new Date(dateKey),
        stock: { connect: { id: stockID } },
      },
    });
  }

  /**
   * Computes a trend (percentage gain/loss in comparison to last entry) for a given stock
   * @param stockID ID from 'Stock'-Table for the stock, which values should be persisted
   * @param stockData Most recent stock-API response for stock with given ID and historic data
   * @param dateKey Date of the given stockData
   */
  async computeTrend(stockID: number, stockData: Object, dateKey: string) {
    // Search for available (historic) datapoints in DB to compute trend
    const historicData = await this.prisma.stockHistory.findMany({
      where: { stockId: stockID },
      orderBy: [
        {
          time: 'desc',
        },
      ],
    });

    // Compute trend by searching the last available datapoint right before the current data (note: available datapoints are in descending order)
    let trend = 0.0;
    if (historicData != null) {
      for (const currentEntry of historicData) {
        if (currentEntry.time < new Date(dateKey)) {
          trend = (+stockData['4. close'] / currentEntry.close - 1) * 100;
          // Round result to two decimal places
          trend = +trend.toFixed(2);
          break;
        }
      }
    }

    return trend;
  }

  /**
   * Sends a request to the stock-API alpha vantage.
   * @param stockSymbol Official stock symbol of the stock, for which the data is requested
   * @param apiFunction Determines the stock-API endpoint. Supported endpoints are listed in the dedicated enumertion
   * @param outputSize Determines the output size of the response- Only relevant for certain endpoints, especially those who return stock values with historic data
   * @returns Data-object of the stock-API response. Find detailed descriptions of the object-properties on https://www.alphavantage.co/documentation/
   */
  async requestStockAPI(stockSymbol: string, apiFunction: ApiFunctions, outputSize?: ApiFunctions) {
    const axios = require('axios');

    // Hardcoded API-key for alpha vantage
    const params = { apikey: '6Q89Q5LYA6SHDOCL' };
    const baseURL = 'https://www.alphavantage.co/query';
    let requestURL: string = `${baseURL}` + `?${apiFunction}` + `&symbol=${stockSymbol}`;

    if (outputSize != null) {
      requestURL += `&${outputSize}`;
    }

    this.logger.debug(`Send request to stock-API via the URL: ${requestURL}`);

    const stockValues = await axios
      .get(requestURL, { params: params })
      .then((response) => {
        const apiResponse = response.data;

        // Verify correct format of response for company details
        if (apiFunction === ApiFunctions.AV_COMPANYDETAILS) {
          if (JSON.stringify(apiResponse).startsWith('{"Symbol":')) {
            this.logger.debug('Received valid API-response for stock-company overview.');
          } else {
            this.logger.debug('Received unexpected API-response (format).');
            return null;
          }

          return apiResponse;
          // Verify correct format of response for stockdata
        } else if (apiFunction === ApiFunctions.AV_DAILY) {
          if (JSON.stringify(apiResponse).startsWith('{"Meta Data":')) {
            this.logger.debug('Received valid API-response for daily stockdata.');
          } else {
            this.logger.debug('Received unexpected API-response (format).');
            return null;
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
}
