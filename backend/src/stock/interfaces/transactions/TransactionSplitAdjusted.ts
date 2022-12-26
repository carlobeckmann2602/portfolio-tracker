import { Transactions } from "@prisma/client";

export interface TransactionSplitAdjusted extends Transactions {
    split: number
    amountAfterSplit: number
    priceAfterSplit: number
}