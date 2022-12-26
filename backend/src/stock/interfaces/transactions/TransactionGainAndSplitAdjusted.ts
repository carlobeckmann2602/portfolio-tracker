import { TransactionSplitAdjusted } from "./TransactionSplitAdjusted";

export interface TransactionGainAndSplitAdjusted extends TransactionSplitAdjusted {
    gainAbsolute: number
    gainPercentage: number
}