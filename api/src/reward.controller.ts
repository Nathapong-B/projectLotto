import { Body, Controller, Get, Post } from "@nestjs/common";
import { PrismaClient, RewardDetail } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

@Controller('/api/reward')
export class RewardController {

    // ดึงข้อมูลรางวัลจากเว็บกองสลาก แล้วบันทึกลงฐานข้อมูล
    @Post('getdataglo')
    async getreward() {
        // สลายโครงสร้าง เพื่อจัดเรียง object ใหม่
        const destructuring = (items: any) => {
            return new Promise((resolve) => {
                let { data, date } = items
                const { first, second, third, fourth, fifth, last2, last3f, last3b, near1 } = data;
                const dataArr = [first, second, third, fourth, fifth, last2, last3f, last3b, near1]
                resolve({ dataArr, date })
            })
        }//end destructuring

        // เก็บข้อมูล object ในอาร์เรย์
        const process = (dataAll: any) => {
            return new Promise((resolve) => {
                const data = dataAll.dataArr
                let dataReward = []
                for (let y = 0; y < data.length; y++) {
                    for (let i = 0; i < data[y].number.length; i++) {
                        switch (y) {
                            case 5: {
                                dataReward.push({
                                    level: 'last2',
                                    number: data[y].number[i].value,
                                    reward: parseInt(data[y].price),
                                    date: dataAll.date
                                });
                                break;
                            }
                            case 6: {
                                dataReward.push({
                                    level: 'last3f',
                                    number: data[y].number[i].value,
                                    reward: parseInt(data[y].price),
                                    date: dataAll.date
                                });
                                break;
                            }
                            case 7: {
                                dataReward.push({
                                    level: 'last3b',
                                    number: data[y].number[i].value,
                                    reward: parseInt(data[y].price),
                                    date: dataAll.date
                                });
                                break;
                            }
                            case 8: {
                                dataReward.push({
                                    level: 'near1',
                                    number: data[y].number[i].value,
                                    reward: parseInt(data[y].price),
                                    date: dataAll.date
                                });
                                break;
                            }
                            default: {
                                dataReward.push({
                                    level: (y + 1).toString(),
                                    number: data[y].number[i].value,
                                    reward: parseInt(data[y].price),
                                    date: dataAll.date
                                });
                                break;
                            }
                        }
                    }
                }
                resolve(dataReward);
            })
        }//end process

        try {
            // ดึงค่าจากงวดก่อนหน้า
            // const date = "01"
            // const month = "02"
            // const year = "2024"
            // const payload = { date, month, year }
            // const res = await axios.post('https://www.glo.or.th/api/lottery/getLotteryAward', payload);

            // ดึงค่าจากงวดล่าสุด
            const res = await axios.post('https://www.glo.or.th/api/lottery/getLatestLottery',);

            const des = await destructuring(res.data.response)
            const pro = await process(des)
            let items = []
            items.push(pro)

            // เช็ควันที่ก่อนเพิ่มข้อมูลลงฐานข้อมูล
            const checkDate = await prisma.rewardDetail.findFirst({ where: { date: res.data.response.date } })
            if (checkDate !== null) {
                console.log("existing")
                return { state: "existing" }
            }

            for (let i = 0; i < items.length; i++) {
                await prisma.rewardDetail.createMany({ data: items[i] })
            }

            console.log("success")
            return { state: "success" }
        } catch (e) {
            console.log(e)
            return { message: e }
        }
    } // end getdataglo ***************************  //  *****************************

    // บันทึกรางวัลลงฐานข้อมูล
    @Post('addrewarddata')
    async addreward(@Body('reward') reward: [RewardDetail]) {
        try {
            for (let i = 0; i < reward.length; i++) {
                await prisma.rewardDetail.createMany({ data: reward[i] })
                // console.log(reward[i])
            }
            return "success"
        } catch (e) {
            console.log(e)
            return { message: e }
        }
    } // end addreward **********************************  //  ****************************

    // แสดงรางวัลล่าสุด
    @Get('lastreward')
    async lastreward() {
        // จัดเรียงข้อมูลให้อยู่ใน object เพื่อสะดวกในการนำไปใช้
        const encap = (items: any) => {
            return new Promise((resolve) => {
                let first = []
                let second = []
                let third = []
                let fourth = []
                let fifth = []
                let last2 = []
                let last3f = []
                let last3b = []
                let near1 = []
                for (let i = 0; i < items.length; i++) {
                    switch (items[i].level) {
                        case '1':
                            first.push(items[i]);
                            break;
                        case '2': {
                            second.push(items[i])
                            break;
                        }
                        case '3': {
                            third.push(items[i])
                            break;
                        }
                        case '4': {
                            fourth.push(items[i])
                            break;
                        }
                        case '5': {
                            fifth.push(items[i])
                            break;
                        }
                        case 'last2': {
                            last2.push(items[i])
                            break;
                        }
                        case 'last3f': {
                            last3f.push(items[i])
                            break;
                        }
                        case 'last3b': {
                            last3b.push(items[i])
                            break;
                        }
                        case 'near1': {
                            near1.push(items[i])
                            break;
                        }
                        default: {
                            console.log(items[i])
                            break;
                        }
                    }
                }
                const rewardExtract = { first, second, third, fourth, fifth, last2, last3f, last3b, near1 }
                // console.log("success encap")
                resolve(rewardExtract);
            })
        } // end encap

        try {
            // ดึงข้อมูลเรคคอร์ดล่าสุด เพื่อเก็บข้อมูลวันที่ไว้
            const findLastRec = await prisma.rewardDetail.findMany({
                orderBy: {
                    // id:'asc'
                    id: 'desc'
                },
                take: 1
            })

            if (findLastRec !== undefined) {
                const date = findLastRec[0].date

                // นำข้อมูลวันที่ดึงเรคคอร์ดทั้งหมดที่ตรงกัน
                const dataAll = await prisma.rewardDetail.findMany({ where: { date: date } })
                if (dataAll !== undefined) {
                    const encapData = await encap(dataAll)

                    return encapData
                }
            }

            return "success"

        } catch (e) {
            return { message: e }
        }
    } // end lastreward *******************************  //  ************************

    // ตรวจสอบสลากทั้งหมด
    @Get('checkalllotto')
    async checkalllotto() {
        try {
            let rewardData: any; //ข้อมูลรางวัล
            let lottoData: any; //ข้อมูลสลาก
            let date: string; //ข้อมูลวันที่

            // ------------- ดึงข้อมูลผลรางวัลและสลาก
            // ดึงข้อมูลเรคคอร์ดล่าสุด เพื่อเก็บข้อมูลวันที่ไว้
            const findLastRec = await prisma.rewardDetail.findMany({
                orderBy: {
                    id: 'desc'
                },
                take: 1
            })

            if (findLastRec !== undefined) {
                // เก็บข้อมูลวันที่ไว้ แล้วนำไปดึงเรคคอร์ดผลรางวัลทั้งหมดที่ตรงกัน
                date = findLastRec[0].date
                rewardData = await prisma.rewardDetail.findMany({ where: { date: date } })
            }
            // ดึงข้อมูลสลาก จากงวดวันที่ออกและ isCheckReward มีค่า false
            lottoData = await prisma.lotto.findMany({ where: { roundDate: date, isCheckReward: 'false' } });

            // ตรวจรางวัล
            // ลูปสลาก
            for (let i = 0; i < lottoData.length; i++) {
                const lottoItem = lottoData[i]
                const lottoNumber = lottoItem.l_number

                // ลูปเลขรางวัล
                for (let j = 0; j < rewardData.length; j++) {
                    const rewardItem = rewardData[j]
                    const rewardNumber = rewardItem.number

                    const level = rewardData[j].level
                    // level ต้องไม่เป็น เลขท้าย2ตัว 3ตัว (รางวัลที่ 1,2,3,4,5,ข้างเคียง)
                    if (level !== "last2" && level !== "last3f" && level !== "last3b") {
                        // ถ้าเลขรางวัลและเลขสลากตรงกัน
                        if (rewardNumber === lottoNumber) {
                            // ค้นหา billSaleId เพื่อนำไปบันทึกในตาราง lottoAwards
                            const billData = await prisma.billSaleDetail.findMany({
                                where: { lottoId: lottoItem.id }
                            })
                            if (billData.length !== 0) {
                                // ลูปเท่ากับจำนวนของบิล
                                for (let k = 0; k < billData.length; k++) {
                                    const billItem = billData[k]
                                    // ค้นหาข้อมูลสลากและบิลดีเทล ว่ามีอยู่ใน lottoAwards แล้วหรือไม่
                                    const checkAwardRec = await prisma.lottoAwards.findFirst({
                                        where: {
                                            lottoId: lottoItem.id,
                                            billSaleDetailId: billItem.id,
                                        }
                                    })
                                    // ถ้ามีค่าเป็น null ให้บันทึกลง lottoAwards
                                    if (checkAwardRec === null) {
                                        await prisma.lottoAwards.create({
                                            data: {
                                                rewardId: rewardItem.id,
                                                lottoId: lottoItem.id,
                                                billSaleId: billItem.billSaleId,
                                                billSaleDetailId: billItem.id,
                                            }
                                        })
                                    }
                                }
                            }
                            // บันทึกข้อมูลสลากในตาราง หากสลากยังเหลือในสต๊อก
                            if (lottoItem.stock > 0) {
                                const dataCheck = await prisma.stockAwards.findFirst({
                                    where: {
                                        rewardId: rewardItem.id,
                                        lottoId: lottoItem.id,
                                    }
                                })
                                if (dataCheck === null) {
                                    await prisma.stockAwards.create({
                                        data: {
                                            rewardId: rewardItem.id,
                                            lottoId: lottoItem.id
                                        }
                                    })
                                }
                            }
                        } // เสร็จสิ้น ถ้าเลขรางวัลและเลขสลากตรงกัน
                    } // เสร็จสิน ตรวจสอบค่า level ต้องไม่เป็น เลขท้าย2ตัว 3ตัว (รางวัลที่ 1,2,3,4,5,ข้างเคียง)
                    if (level === "last3f") {
                        const lottoNumberl3f = lottoNumber.substr(0, 3)
                        if (lottoNumberl3f === rewardNumber) {
                            // ค้นหา billSaleId เพื่อนำไปบันทึกในตาราง lottoAwards
                            const billData = await prisma.billSaleDetail.findMany({
                                where: { lottoId: lottoItem.id }
                            })
                            if (billData.length !== 0) {
                                // ลูปเท่ากับจำนวนของบิล
                                for (let k = 0; k < billData.length; k++) {
                                    const billItem = billData[k]
                                    // ค้นหาข้อมูลสลากและบิลดีเทล ว่ามีอยู่ใน lottoAwards แล้วหรือไม่
                                    const checkAwardRec = await prisma.lottoAwards.findFirst({
                                        where: {
                                            lottoId: lottoItem.id,
                                            billSaleDetailId: billItem.id,
                                        }
                                    })
                                    // ถ้ามีค่าเป็น null ให้บันทึกลง lottoAwards
                                    if (checkAwardRec === null) {
                                        await prisma.lottoAwards.create({
                                            data: {
                                                rewardId: rewardItem.id,
                                                lottoId: lottoItem.id,
                                                billSaleId: billItem.billSaleId,
                                                billSaleDetailId: billItem.id,
                                            }
                                        })
                                    }
                                }
                            }
                            // บันทึกข้อมูลสลากในตาราง หากสลากยังเหลือในสต๊อก
                            if (lottoItem.stock > 0) {
                                const dataCheck = await prisma.stockAwards.findFirst({
                                    where: {
                                        rewardId: rewardItem.id,
                                        lottoId: lottoItem.id,
                                    }
                                })
                                if (dataCheck === null) {
                                    await prisma.stockAwards.create({
                                        data: {
                                            rewardId: rewardItem.id,
                                            lottoId: lottoItem.id
                                        }
                                    })
                                }
                            }
                        }
                    } // last3f
                    if (level === "last3b") {
                        const lottoNumberl3b = lottoNumber.substr(-3)
                        if (lottoNumberl3b === rewardNumber) {
                            // ค้นหา billSaleId เพื่อนำไปบันทึกในตาราง lottoAwards
                            const billData = await prisma.billSaleDetail.findMany({
                                where: { lottoId: lottoItem.id }
                            })
                            if (billData.length !== 0) {
                                // ลูปเท่ากับจำนวนของบิล
                                for (let k = 0; k < billData.length; k++) {
                                    const billItem = billData[k]
                                    // ค้นหาข้อมูลสลากและบิลดีเทล ว่ามีอยู่ใน lottoAwards แล้วหรือไม่
                                    const checkAwardRec = await prisma.lottoAwards.findFirst({
                                        where: {
                                            lottoId: lottoItem.id,
                                            billSaleDetailId: billItem.id,
                                        }
                                    })
                                    // ถ้ามีค่าเป็น null ให้บันทึกลง lottoAwards
                                    if (checkAwardRec === null) {
                                        await prisma.lottoAwards.create({
                                            data: {
                                                rewardId: rewardItem.id,
                                                lottoId: lottoItem.id,
                                                billSaleId: billItem.billSaleId,
                                                billSaleDetailId: billItem.id,
                                            }
                                        })
                                    }
                                }
                            }
                            // บันทึกข้อมูลสลากในตาราง หากสลากยังเหลือในสต๊อก
                            if (lottoItem.stock > 0) {
                                const dataCheck = await prisma.stockAwards.findFirst({
                                    where: {
                                        rewardId: rewardItem.id,
                                        lottoId: lottoItem.id,
                                    }
                                })
                                if (dataCheck === null) {
                                    await prisma.stockAwards.create({
                                        data: {
                                            rewardId: rewardItem.id,
                                            lottoId: lottoItem.id
                                        }
                                    })
                                }
                            }
                        }
                    } // end last3b
                    if (level === "last2") {
                        const lottoNumberl2 = lottoNumber.substr(-2)
                        if (lottoNumberl2 === rewardNumber) {
                            // ค้นหา billSaleId เพื่อนำไปบันทึกในตาราง lottoAwards
                            const billData = await prisma.billSaleDetail.findMany({
                                where: { lottoId: lottoItem.id }
                            })
                            if (billData.length !== 0) {
                                // ลูปเท่ากับจำนวนของบิล
                                for (let k = 0; k < billData.length; k++) {
                                    const billItem = billData[k]
                                    // ค้นหาข้อมูลสลากและบิลดีเทล ว่ามีอยู่ใน lottoAwards แล้วหรือไม่
                                    const checkAwardRec = await prisma.lottoAwards.findFirst({
                                        where: {
                                            lottoId: lottoItem.id,
                                            billSaleDetailId: billItem.id,
                                        }
                                    })
                                    // ถ้ามีค่าเป็น null ให้บันทึกลง lottoAwards
                                    if (checkAwardRec === null) {
                                        await prisma.lottoAwards.create({
                                            data: {
                                                rewardId: rewardItem.id,
                                                lottoId: lottoItem.id,
                                                billSaleId: billItem.billSaleId,
                                                billSaleDetailId: billItem.id,
                                            }
                                        })
                                    }
                                }
                            }
                            // บันทึกข้อมูลสลากในตาราง หากสลากยังเหลือในสต๊อก
                            if (lottoItem.stock > 0) {
                                const dataCheck = await prisma.stockAwards.findFirst({
                                    where: {
                                        rewardId: rewardItem.id,
                                        lottoId: lottoItem.id,
                                    }
                                })
                                if (dataCheck === null) {
                                    await prisma.stockAwards.create({
                                        data: {
                                            rewardId: rewardItem.id,
                                            lottoId: lottoItem.id
                                        }
                                    })
                                }
                            }
                        }
                    } // end last2
                } // เสร็จสิ้น ลูปเลขรางวัล

                // อัพเดทค่า isCheckReward เป็นค่า true
                await prisma.lotto.update({ data: { isCheckReward: "true" }, where: { id: lottoItem.id } })
            } // เสร็จสิ้น ลูปสลาก
            // ตรวจรางวัล เสร็จสิ้น

            return "success"

        } catch (e) {
            return { message: e }
        }
    } // end checkalllotto *************************** // ******************

    @Get('billwinning')
    async billwinning() {
        try {
            return await prisma.billSale.findMany({
                where: {
                    // ดึงข้อมูลจาก บิลเซล เฉพาะที่คอลัมน์ lottoAwards มีค่าบันทึกอยู่(หรือถูกรางวัลเท่านั้น)
                    lottoAwards: {
                        some: {}
                    }
                },
                include: {
                    BillSaleDetail: {
                        include: {
                            lotto: true,
                            lottoAwards: {
                                include: {
                                    reward: true,
                                }
                            }
                        }
                    },
                    lottoAwards: true
                },
                orderBy: {
                    id: 'asc'
                }
            })
        } catch (e) {
            return { message: e }
        }
    } // end billwinning ********************  //  ********************

    @Get('testapi')
    async testapi(@Body() period: { startDate: string, endDate: string }) {
        // ดึงข้อมูลจาก บิลเซล เฉพาะที่คอลัมน์ lottoAwards มีค่า(หรือถูกรางวัลเท่านั้น)
        const winning = async () => {
            const data = await prisma.billSale.findMany({
                where: {
                    // NOT: {
                    lottoAwards: {
                        some: {},
                    },
                    // }
                }
            })
            return data;
        } // end winning

        try {
            const data = await prisma.billSale.findMany({
                where: {
                    payDate: {
                        not: null,
                        gte: new Date(period.startDate),
                        lte: new Date(period.endDate)
                    },
                }
            })

            console.log(period.startDate)
            console.log(period.endDate)
            return data
        } catch (e) {
            console.log(e.message)
            return { message: e }
        }
    }

}