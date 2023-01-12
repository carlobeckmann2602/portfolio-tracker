import { TransactionAgregationDataWithStockInfo } from './TransactionAgregationDataWithStockInfo';

export interface TransactionAgregationCollectionWithStockInfo {
  [stockId: string]: TransactionAgregationDataWithStockInfo;
}
