import { Stock } from "@prisma/client";
export interface StockGainAndSplitAdjusted extends Stock {
    amountAfterSplit: number,
    price: number,
    trend: number,
    gainAbsolute: number,
    gainPercentage: number
}