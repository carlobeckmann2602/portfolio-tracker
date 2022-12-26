import { StockGainAndSplitAdjusted } from "src/stock/interfaces/StockGainAndSplitAdjusted"

export interface Portfolio {
    currentValue: number
    gainAbsolute: number
    gainPercentage: number
    stocks: StockGainAndSplitAdjusted[]
}