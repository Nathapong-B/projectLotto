import { Body, Controller, Get, Post } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Controller('/api/balancesheet')
export class BalanceSheetController {
    @Post('balancesheet')
    async balancesheet(@Body() period: { roundDate: string, startDate: string, endDate: string }) {
        try {
            if(period.roundDate===undefined){
                throw new Error('error');
            }
            const billsale = await prisma.billSale.findMany({
                where: {
                    payDate: {
                        not: null,
                        gte: new Date(period.startDate),
                        lte: new Date(period.endDate)
                    },
                },
                include: {
                    BillSaleDetail: {
                        include: {
                            lotto: true,
                        }
                    }
                },
                orderBy: {
                    id: 'asc'
                }
            })

            const lotto = await prisma.lotto.findMany({
                where: {
                    roundDate: period.roundDate,
                },
            })

            const stockWin = await prisma.stockAwards.findMany({
                where: {
                    lotto: {
                        roundDate: period.roundDate,
                    }
                },
                include: {
                    lotto: true,
                    reward: true,
                }
            })
            return { billsale, lotto, stockWin }
        } catch (e) {
            console.log(e)
            return { message: e.message }
        }
    } // end balancesheet  **************************  //  ***********************
}