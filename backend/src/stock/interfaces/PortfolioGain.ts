import { TransactionGainAndSplitAdjusted } from "./transactions/TransactionGainAndSplitAdjusted";

export interface PortfolioWithGain {
    gainAbsolute: number,
    gainPercent: number,
    gainAndSplitAdjustedTransaction: TransactionGainAndSplitAdjusted[]
}