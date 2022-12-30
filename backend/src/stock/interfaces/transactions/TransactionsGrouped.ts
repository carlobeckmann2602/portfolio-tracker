import { TransactionSplitAdjusted } from "./TransactionSplitAdjusted";

export interface TransactionsGrouped {
    [key: string]: TransactionSplitAdjusted[]
}