import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';


const prisma = new PrismaClient()
async function main() {
    await prisma.user.createMany({
        data: [
            { email: "user1@test.test", hash: await argon.hash("password"), portfoliovalue: 0 },
            { email: "user2@test.test", hash: await argon.hash("password"), portfoliovalue: 0 },
            { email: "user3@test.test", hash: await argon.hash("password"), portfoliovalue: 0 },
        ],
        skipDuplicates: true
    })

    const stocks = [];
    for (let i = 1; i <= 20; i++) {
        const stock = {
            name: `STOCK${i} NAME`,
            symbol: `Stock${i} SYMBOL`
        }
        stocks.push(stock)
    }

    await prisma.stock.createMany({
        data: stocks,
        skipDuplicates: true
    })

    const stockHistories = [
        { split: 1, open: 90.0, close: 90.0, high: 90.0, low: 90.0, trend: 0, time: new Date("2022-12-02T10:00:00"), stock: { connect: { name: "STOCK1 NAME", } }, },
        { split: 2, open: 100.0, close: 100.0, high: 100.0, low: 100.0, trend: 0, time: new Date("2022-12-05T10:00:00"), stock: { connect: { name: "STOCK1 NAME", } }, },
        { split: 2, open: 100.0, close: 100.0, high: 100.0, low: 100.0, trend: 0, time: new Date("2022-12-05T10:00:00"), stock: { connect: { name: "STOCK1 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-10T10:00:00"), stock: { connect: { name: "STOCK1 NAME", } }, },
        { split: 4, open: 120.0, close: 120.0, high: 120.0, low: 120.0, trend: 0, time: new Date("2022-12-12T10:00:00"), stock: { connect: { name: "STOCK1 NAME", } }, },
        { split: 1, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-02T10:00:00"), stock: { connect: { name: "STOCK2 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK2 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK3 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK4 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK5 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK6 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK7 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK8 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK9 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK10 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK11 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK12 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK13 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK14 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK15 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK16 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK17 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK18 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK19 NAME", } }, },
        { split: 3, open: 110.0, close: 110.0, high: 110.0, low: 110.0, trend: 0, time: new Date("2022-12-03T10:00:00"), stock: { connect: { name: "STOCK20 NAME", } }, },
    ];

    for (const stockHistory of stockHistories) {
        const stockHistoryInDb = await prisma.stockHistory.findFirst({
            where: {
                split: stockHistory.split,
                open: stockHistory.open,
                close: stockHistory.close,
                high: stockHistory.close,
                low: stockHistory.low,
                trend: stockHistory.trend,
                time: stockHistory.time,
                stock: { name: stockHistory.stock.connect.name },
            }
        });
        if (!stockHistoryInDb) {
            await prisma.stockHistory.create({
                data: stockHistory,
            })
        }
    }

    const transactions = [
        { amount: 20, buy: true, price: 100, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK1 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 10, buy: true, price: 100, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK1 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK1 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 20, buy: true, price: 100, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK2 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 10, buy: true, price: 100, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK2 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK2 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK3 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK4 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK5 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK6 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK7 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK8 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK9 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK10 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK11 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK12 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK13 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK14 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK15 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK16 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK17 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK18 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK19 NAME" } }, user: { connect: { email: "user1@test.test" } } },
        { amount: 5, buy: false, price: 80, time: new Date("2022-12-01T10:00:00"), stock: { connect: { name: "STOCK20 NAME" } }, user: { connect: { email: "user1@test.test" } } },
    ]


    for (const transaction of transactions) {
        const transactionInDB = await prisma.transactions.findFirst({
            where: {
                amount: transaction.amount,
                buy: transaction.buy,
                price: transaction.price,
                time: transaction.time,
                stock: { name: transaction.stock.connect.name },
                user: { email: transaction.user.connect.email },
            }
        })

        if (!transactionInDB) {
            await prisma.transactions.create({ data: transaction });
        }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })