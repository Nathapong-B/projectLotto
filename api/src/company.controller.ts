import { Body, Controller, Get, Headers, Param, Post, Put } from "@nestjs/common";
import { PrismaClient, Company } from "@prisma/client";

const prisma = new PrismaClient();

@Controller('/api/company')
export class CompanyController {
    @Post('create')
    async create(@Body() company: Company) {
        try {
            return await prisma.company.create({ data: company });
        } catch (e) {
            return { status: 500, message: e.message }
        }
    } //end @post_create

    @Get('info')
    async info(){
        try{
            return await prisma.company.findFirst();
        }catch(e){
            return {status: 500, message: e.message}
        }
    } //end @get_info

    @Put('edit/:id')
    async edituser(@Param('id') id: string, @Body() company: Company) {
        try {
            const editId = parseInt(id);
            return await prisma.company.update({ data: company, where: { id: editId } });
        } catch (e) {
            return { status: 500, message: e.message }
        }
    } //end @put_edit
}