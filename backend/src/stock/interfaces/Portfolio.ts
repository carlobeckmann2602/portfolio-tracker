import { StockGainAndSplitAdjusted } from "src/stock/interfaces/StockGainAndSplitAdjusted"

export interface Portfolio {
    currentPortfolioValue: number
    gainAbsolute: number
    gainPercentage: number
    stocks: StockGainAndSplitAdjusted[]
}