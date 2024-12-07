import { Body, Controller, Delete, Get, Param, Post, Put, UnauthorizedException, Headers, UseGuards } from "@nestjs/common";
import { PrismaClient, User } from "@prisma/client";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
// import { AuthGuard } from "@nestjs/passport";
// import { JwtStrategy } from "./jwt.strategy";
import { JwtGuard } from "./auth.guard";
// import { JwtGuards } from "./auth.guard";
import { jwtConstant } from "./constant";

const prisma = new PrismaClient();
let hashPassword: string;

@Controller('/api/user')
export class UserController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        // private readonly jwtStrategy: JwtStrategy
    ) { }

    @UseGuards(JwtGuard)
    @Get('list')
    async list() {
        // async list(@Headers('Authorization') auth: string) {
        // const tkn = await this.jwtStrategy.validate(auth)
        // console.log(tkn)
        return await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                user: true,
                level: true,
                email: true,
                phone: true,
                address: true,
            },
            orderBy: {
                id: 'asc'
            }
        });
    } // end @get

    @Post('create')
    async create(@Body() user: User) {
        try {
            if (user.user === '' || user.pwd === '' || user.email === '') {
                throw new Error('Please fill out Data completely');
            }

            user.user = user.user.toLowerCase()

            const checkUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { user: user.user },
                        { email: user.email }
                    ]
                }
            })

            if (checkUser !== null) {
                throw new Error('already');
            }

            //test hash
            const saltRound = 10;
            const password = user.pwd;
            hashPassword = await bcrypt.hash(password, saltRound);
            user.pwd = hashPassword;
            //end test

            const res = await prisma.user.create({ data: user });
            if (res.id !== undefined) {
                return { state: 'success' }
            }
        } catch (e) {
            if (e.message === "already") {
                return { state: e.message }
            }
            return { status: 500, message: e.message };
        }
    } // end @post

    @Put('edit/:id')
    async edituser(@Param('id') id: string, @Body() usr: User) {
        // async edituser(@Param('id') id: string, @Body() usr: { user_name: string, password: string }) {
        try {
            const editId = parseInt(id);
            return await prisma.user.update({ data: usr, where: { id: editId } });
            // console.log(usr)
        } catch (e) {
            return { status: 500, message: e.message }
        }
    } //end @put

    @Delete('del/:id')
    async deleteuser(@Param('id') id: string) {
        try {
            const delId = parseInt(id);
            const res = await prisma.user.delete({ where: { id: delId } });
            if (res.id !== undefined) {
                return { state: 'success' }
            }
        } catch (e) {
            return { status: 500, message: e.message }
        }
    }// end @delete

    @Post('login')
    //async login(@Body() usr: { user: string; pwd: string }) { //ตัวแปรที่รับมาจาก font end ต้องตั้งชื่อให้ตรงกัน (user,pwd)
    async login(@Body() usr: User) {
        try {
            if (usr.user === undefined || usr.pwd === undefined) {
                return { message: "username or password invalid" }
            }

            usr.user = usr.user.toLowerCase()

            const userData = await prisma.user.findFirst({
                where: {
                    user: usr.user,
                    // pwd: usr.pwd,
                },
            });

            // -- test hash --
            const passMatch = userData ? await bcrypt.compare(usr.pwd, userData.pwd) : false;
            // console.log(passMatch)
            // -- end test --

            if (passMatch) {
                // if (userData) {
                const token = await this.authService.login(userData);

                // บันทึก refresh token ลงในฐานข้อมูล
                await prisma.user.update({
                    data: { ref_token: token.refresh_token },
                    where: { id: userData.id, }
                })
                return { token: token };
            }

            throw new UnauthorizedException('(sv)username or password invalid');

        } catch (e) {
            return { message: e.message };
        }
    } //end @post

    @Get('info')
    async info(@Headers('Authorization') auth: string) { //รับค่าแบบ Headers ตั้งเป็น Authorization ค่าที่ส่งมาต้องตั้งให้ตรงกัน
        // async info(@Headers('Auth') auth: string) {
        try {
            const jwt = auth.replace('Bearer ', '');
            // const payload = await this.jwtService.decode(jwt);

            // Token ถ้าหมดอายุจะ return error ทำให้โปรแกรมกระโดดไปที่ catch
            const verifyToken = await this.authService.verifyToken(jwt);

            // ถ้า Token ยังไม่หมดอายุจะคืนค่าการถอดรหัสมา
            // delete verifyToken.iat;
            // delete verifyToken.exp;
            // console.log(verifyToken)

            const user = await prisma.user.findFirst({
                select: {
                    id: true,
                    name: true,
                    user: true,
                    level: true,
                    email: true,
                    phone: true,
                    address: true,
                },
                where: { id: verifyToken.sub }
                // where: { id: payload.sub }
            })

            console.log('Token Verify Success')
            return { message: 'Verify Token Success', payload: verifyToken, info: user };
            // return { payload: payload, info: user };
        } catch (e) {
            console.log(e)
            return { message: e.message };
        }
    } // end @get_info

    @Post('auth/refresh')
    async refreshtoken(@Headers('Authorization') auth: string) {
        try {
            // นำค่า auth มา varify เก็บค่าใน payload เพื่อเอาข้อมูลยูเซอ ไปค้นหาโทเคนในฐานข้อมูล
            // ค้นหาข้อมูลผู้ใช้ เก็บค่าใน userData
            // นำค่า auth มาเปรียบเทียบกับค่า userData.ref_token ว่าตรงกันหรือไม่ **หากไม่ตรงกันอาจเป็นไปได้ว่า โทเคนอาจเคยใช้ไปแล้ว แจ้งให้ผู้ใช้ เข้าระบบใหม่
            // ทำการ generate token ชุดใหม่
            // อัพเดท refresh token ในฐานข้อมูล
        } catch (e) {
            console.log(e)
            return { message: e.message }
        }
    } // end refresh token


    // test call function
    @Post('testapi')
    async testapi() {
        try {
            console.log('test api')
            if (true) {
                throw new Error('this is error test api');
            }

            return 'test';
        } catch (e) {
            console.log(e)
            // const res = await this.testcallapi('test')
            // console.log(res)
            return { message: e.message }
        }
    }

    @Get('testcallapi')
    async testcallapi(@Body() input:string, @Headers() auth:string) {
        console.log('in test call api')
        console.log(input)
        console.log(auth)
        return { message: 'test call api' }
    }

}