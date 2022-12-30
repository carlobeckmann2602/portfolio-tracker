import { TransactionAgregationData } from "./TransactionAgregationData";

export interface TransactionAgregationCollection {
    [stockId: number]: TransactionAgregationData
}