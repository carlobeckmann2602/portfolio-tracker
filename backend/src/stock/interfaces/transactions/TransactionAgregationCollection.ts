import { TransactionAgregationData } from './TransactionAgregationData';

export interface TransactionAgregationCollection {
  [stockId: string]: TransactionAgregationData;
}
