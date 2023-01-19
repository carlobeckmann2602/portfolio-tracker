import { Stock, StockHistory } from '@prisma/client';
import { TransactionAgregationData } from './TransactionAgregationData';

export interface TransactionAgregationDataWithStockInfo {
  aggregationData: TransactionAgregationData;
  stockInfo: Stock & { histories: StockHistory[] };
}
