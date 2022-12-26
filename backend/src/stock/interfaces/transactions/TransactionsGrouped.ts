import { TransactionGainAndSplitAdjusted } from "./TransactionGainAndSplitAdjusted";

export interface TransactionsGrouped {
    [key: string]: TransactionGainAndSplitAdjusted[]
}