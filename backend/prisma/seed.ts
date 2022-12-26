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

    await prisma.stock.createMany({
        data: [
            { name: "STOCK1 NAME", symbol: "STOCK1 SYMBOL" },
            { name: "STOCK2 NAME", symbol: "STOCK2 SYMBOL" },
            { name: "STOCK3 NAME", symbol: "STOCK3 SYMBOL" },
        ],
        skipDuplicates: true
    })

    await prisma.stockHistory.create({
        data: {
            split: 1,
            open: 90.0,
            close: 90.0,
            high: 90.0,
            low: 90.0,
            trend: 0,
            time: new Date("2022-12-02T10:00:00"),
            stock: {
                connect: {
                    name: "STOCK1 NAME",
                }
            },
        }
    })
    await prisma.stockHistory.create({
        data: {
            split: 2,
            open: 100.0,
            close: 100.0,
            high: 100.0,
            low: 100.0,
            trend: 0,
            time: new Date("2022-12-05T10:00:00"),
            stock: {
                connect: {
                    name: "STOCK1 NAME",
                }
            },
        }
    })
    await prisma.stockHistory.create({
        data: {
            split: 3,
            open: 110.0,
            close: 110.0,
            high: 110.0,
            low: 110.0,
            trend: 0,
            time: new Date("2022-12-10T10:00:00"),
            stock: {
                connect: {
                    name: "STOCK1 NAME",
                }
            },
        }
    })



    await prisma.stockHistory.create({
        data: {
            split: 4,
            open: 120.0,
            close: 120.0,
            high: 120.0,
            low: 120.0,
            trend: 0,
            time: new Date("2022-12-12T10:00:00"),
            stock: {
                connect: {
                    name: "STOCK1 NAME",
                }
            },
        }
    })

    await prisma.stockHistory.create({
        data: {
            split: 1,
            open: 110.0,
            close: 110.0,
            high: 110.0,
            low: 110.0,
            trend: 0,
            time: new Date("2022-12-02T10:00:00"),
            stock: {
                connect: {
                    name: "STOCK2 NAME",
                }
            },
        }
    })

    await prisma.stockHistory.create({
        data: {
            split: 3,
            open: 110.0,
            close: 110.0,
            high: 110.0,
            low: 110.0,
            trend: 0,
            time: new Date("2022-12-03T10:00:00"),
            stock: {
                connect: {
                    name: "STOCK2 NAME",
                }
            },
        }
    })

    await prisma.transactions.create({
        data: {
            amount: 20,
            buy: true,
            price: 100,
            time: new Date("2022-12-01T10:00:00"),
            stock: { connect: { name: "STOCK1 NAME" } },
            user: { connect: { email: "user1@test.test" } }
        },
    })

    await prisma.transactions.create({
        data: {
            amount: 10,
            buy: true,
            price: 100,
            time: new Date("2022-12-01T10:00:00"),
            stock: { connect: { name: "STOCK1 NAME" } },
            user: { connect: { email: "user1@test.test" } }
        },
    })

    await prisma.transactions.create({
        data: {
            amount: 5,
            buy: false,
            price: 80,
            time: new Date("2022-12-01T10:00:00"),
            stock: { connect: { name: "STOCK1 NAME" } },
            user: { connect: { email: "user1@test.test" } }
        },
    })

    await prisma.transactions.create({
        data: {
            amount: 20,
            buy: true,
            price: 100,
            time: new Date("2022-12-01T10:00:00"),
            stock: { connect: { name: "STOCK2 NAME" } },
            user: { connect: { email: "user1@test.test" } }
        },
    })

    await prisma.transactions.create({
        data: {
            amount: 10,
            buy: true,
            price: 100,
            time: new Date("2022-12-01T10:00:00"),
            stock: { connect: { name: "STOCK2 NAME" } },
            user: { connect: { email: "user1@test.test" } }
        },
    })

    await prisma.transactions.create({
        data: {
            amount: 5,
            buy: false,
            price: 80,
            time: new Date("2022-12-01T10:00:00"),
            stock: { connect: { name: "STOCK2 NAME" } },
            user: { connect: { email: "user1@test.test" } }
        },
    })

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