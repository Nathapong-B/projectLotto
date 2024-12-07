import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { PrismaClient, Lotto, BillSaleDetail, BillSale } from "@prisma/client";

const prisma = new PrismaClient();

@Controller('/api/lotto')
export class LottoController {

    @Get('list')
    async list() {
        return await prisma.lotto.findMany({
            orderBy: {
                id: 'desc'
            },
            where: {
                isCheckReward: "false"
            }
        });
        // return await prisma.lotto.findMany({skip:0,take:12});
    } // end @get_list

    @Post('create')
    async create(@Body() lotto: Lotto) {
        try {
            return await prisma.lotto.create({ data: lotto });
        } catch (e) {
            console.log(e)
            return { status: 500, message: e.message };
        }
    } // end @post_create

    @Delete('del/:id')
    async remove(@Param('id') id: string) {
        try {
            const idInt = parseInt(id);
            return await prisma.lotto.delete({ where: { id: idInt } })
        } catch (e) {
            return { status: 500, message: e.message }
        }
    } // end delete

    @Put('edit/:id')
    async edit(@Param('id') id: string, @Body() lotto: Lotto) {
        try {
            const idInt = parseInt(id);
            return await prisma.lotto.update({ data: lotto, where: { id: idInt } })
        } catch (e) {
            return { status: 500, message: e.message }
        }
    } // end edit

    @Post('search')
    async search(@Body() input: { number: string, position: string }) {
        try {
            const condition = input.position == "start" ? { startsWith: input.number } : { endsWith: input.number };

            return input.number === undefined ? "Variable error"
                : await prisma.lotto.findMany({ where: { l_number: condition } });
            // return await prisma.lotto.findMany({ where: { l_number: { endsWith: input.number } } });
        } catch (e) {
            return { status: 500, message: e.message }
        }
    }// end @search

    @Post('confirmbuy')
    async confirmbuy(@Body() billsale: BillSale, @Body('cart') cart: [BillSaleDetail]) {
        try {
            const stockChecking = (order: any) => {
                return new Promise(async (resolve, reject) => {
                    let Arr = [];
                    // เช็คสต๊อกทุกรายการก่อนตัดสต๊อก
                    for (let i = 0; i < order.length; i++) {
                        const cartId = order[i].item.id;
                        // ค้นหาราคาและเลขสลากจากฐานข้อมูลโดยตรง เพื่อป้องกันการแก้ราคาจากหน้าบ้าน 
                        const item = await prisma.lotto.findFirst({ where: { id: cartId } })
                        const stockCheck = item.stock - order[i].Qty
                        if (stockCheck < 0) {
                            // เคลียร์ค่าในอาเรย์ทั้งหมด
                            while (Arr.length > 0) {
                                Arr.pop();
                            }
                            break;
                        } else {
                            Arr.push({ lottoId: item.id, sale: item.sale, Qty: order[i].Qty })
                        }
                    }

                    if (Arr.length === 0) {
                        reject('out of stock');
                    } else {
                        // console.log("stockChecking")
                        resolve(Arr)
                    }
                })
            } // end stockChecking

            const updateStock = async (order: any) => {
                return new Promise(async (resolve) => {
                    // หากสต๊อกทุกรายการสั่งซื้อไม่ติดลบ จะทำการตัดสต๊อก
                    for (let i = 0; i < order.length; i++) {
                        const cartId = order[i].item.id;
                        const stock = order[i].item.stock - order[i].Qty
                        await prisma.lotto.update({ data: { stock: stock, }, where: { id: cartId } })
                    }
                    // console.log("update stock")
                    resolve(true)
                })
            } // end updateStock

            const createBillsaleAndBilldetail = (bill: any, order: any) => {
                return new Promise(async (resolve) => {
                    // บันทึก BillSale และ BillSaleDetail
                    const result = await prisma.billSale.create({
                        data: {
                            customerName: bill.customerName,
                            customerPhone: bill.customerPhone,
                            customerAddress: bill.customerAddress,
                            payDate: bill.payDate,
                            createdDate: new Date(),
                            BillSaleDetail: {
                                createMany: {
                                    data: order
                                }
                            }
                        }
                    })
                    // console.log("createBill")
                    resolve(result)
                })
            } // end createBillsale

            const items = await stockChecking(cart)
                .catch((e) => {
                    console.log(e)
                    throw new Error(e)
                })
            const upStock = await updateStock(cart)
            if (upStock) {
                const billSale = await createBillsaleAndBilldetail(billsale, items)
                // console.log("process success")
                return { state: "success", bill: billSale }
            }
            // console.log(billSale)
            // return "success"
        } catch (e) {
            // console.log(stock)
            return { message: e.message }
        }
    } // end confirmbuy

    @Get('billsale')
    async billsale() {
        try {
            return await prisma.billSale.findMany({
                orderBy: {
                    id: 'desc'
                },
                include: {
                    BillSaleDetail: {
                        include: {
                            lotto: true,
                        }
                    }
                }
            })
        } catch (e) {
            return { message: e.message }
        }
    } // end get billsale

    @Delete('removebill/:id')
    async removebill(@Param('id') id: string) {
        try {
            const find = (id: any) => {
                return new Promise(async (resolve) => {
                    const idInt = parseInt(id);
                    const resBill = await prisma.billSale.findFirst({
                        where: { id: idInt },
                        include: {
                            BillSaleDetail: {
                                include: { lotto: true, }
                            }
                        }
                    })
                    const billdetail = resBill.BillSaleDetail
                    resolve(billdetail)
                })
            } // end find ค้นหาข้อมูลจาก billSaleDetail เพื่อเก็บข้อมูล lottId และ Qty

            const isRemove = (billId: any) => {
                return new Promise(async (resolve) => {
                    const idInt = parseInt(id);
                    const delBillsaledetail = prisma.billSaleDetail.deleteMany({ where: { billSaleId: idInt } })
                    const delBillsale = prisma.billSale.delete({ where: { id: idInt } })
                    const transaction = await prisma.$transaction([delBillsaledetail, delBillsale])

                    // console.log(transaction[1].id)
                    resolve(transaction)
                })
            } // end isRemove

            const returnQty = (idLotto: any) => {
                return new Promise(async (resolve) => {
                    for (let i = 0; i < idLotto.length; i++) {
                        const item = idLotto[i]
                        const stock = item.lotto.stock + item.Qty
                        await prisma.lotto.update({
                            data: { stock: stock },
                            where: { id: item.lottoId }
                        })
                    }
                    resolve(true)
                })
            } // end returnQty

            const findId = await find(id)
            await isRemove(id)
            await returnQty(findId)

            return { state: "success" }
        } catch (e) {
            console.log(e)
            return { status: 500, message: e.message }
        }
    } // end removebill

    @Put('confirmbill/:id')
    async confirmbill(@Param('id') id: string, @Body('confirmState') confirmState: string) {
        try {
            const idInt = parseInt(id);
            const res = await prisma.billSale.update({ data: { confirmState: confirmState }, where: { id: idInt } })
            return { state: "success" }
        } catch (e) {
            console.log(e)
            return { message: e.message };
        }
    } // end put confirmstate

    // -- ทดสอบคิวรี่ข้อมูลบางส่วน --
    @Get('testget')
    async testget(@Query() params: { page: string, limit: string }) {
        try {
            const paramSkip = parseInt(params.page);
            const paramTake = parseInt(params.limit);
            const res = await prisma.lotto.findMany({ skip: paramSkip, take: paramTake })
            // console.log(params.page)
            // console.log(params.limit)
            // console.log(res)
            return { res };
        } catch (e) {
            console.log(e)
            return { message: e.message };
        }
    } // end @testget
}