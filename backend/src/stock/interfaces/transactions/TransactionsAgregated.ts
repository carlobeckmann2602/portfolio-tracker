import { StockGainAndSplitAdjusted } from "../StockGainAndSplitAdjusted"

export interface TransactionsAgregated {
    [key: string]: StockGainAndSplitAdjusted
}