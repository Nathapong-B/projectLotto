import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { PositionBanner, PrismaClient } from "@prisma/client";
import { diskStorage } from "multer";
import { extname } from "path";
import * as fs from 'node:fs'

const prisma = new PrismaClient();

@Controller('/api/banner')
export class BannerController {

    @Post('upload')
    @UseInterceptors(FileInterceptor('myfile', {
        storage: diskStorage({
            destination: './uploads',

            // -- ใช้ชื่อไฟล์รูปภาพเดิม
            // filename: (req, file, cb) => {
            //     return cb(null, `${file.originalname}`)
            // },

            // -- สุ่มชื่อไฟล์รูปภาพ
            filename: (req, file, cb) => {
                const randomFilename = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                return cb(null, `${randomFilename}${extname(file.originalname)}`)
            },
        }),
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        try {
            // console.log(file)
            const filePath = file.destination.substring(1) + "/" + file.filename;
            const res = await prisma.banner.create({
                data: {
                    name: file.filename,
                    src: filePath,
                    type: file.mimetype,
                    size: file.size,
                }
            })
            // console.log(file.mimetype)
            return { file: file, describe: res }
        } catch (e) {
            console.log(e)
            return { status: 500, message: e.message }
        }
    } // end upload

    @Get('list')
    async list() {
        try {
            const res = await prisma.banner.findMany()
            if (res) {
                return { data: res }
            }
        } catch (e) {
            console.log(e)
            return { status: 500, message: e.message }
        }
    } // end list

    @Delete('delete/:id')
    async delete(@Param('id') id: string) {
        try {
            const idInt = parseInt(id)
            // const fs = require('fs');

            const findFile = await prisma.banner.findFirst({
                where: {
                    id: idInt,
                }
            })

            if (findFile) {
                // await fs.unlink('.' + findFile.src);
                fs.unlinkSync('.' + findFile.src);

                const res = await prisma.banner.delete({
                    where: {
                        id: idInt,
                    }
                })

                if (res.id !== undefined) {
                    return { state: 'success' }
                }
            }

            throw new Error('delete error')
        } catch (e) {
            console.log(e)
            return { status: 500, message: e.message }
        }
    } // end delete

    @Get('positionlist')
    async positionlist() {
        try {
            const res = await prisma.positionBanner.findMany({
                orderBy: {
                    id: 'asc'
                }
            })
            if (res) {
                return { data: res }
            }
        } catch (e) {
            console.log(e)
            return { status: 500, message: e.message }
        }
    } // end position

    @Post('addposition')
    async addposition(@Body() input: PositionBanner) {
        try {
            const res = await prisma.positionBanner.create({ data: input })
            if (res.id !== undefined) {
                return { state: "success" }
            }
        } catch (e) {
            console.log(e)
            return { status: 500, message: e.message }
        }
    } // end addposition

    @Put('editposition')
    async editposition(@Body() input: [PositionBanner]) {
        try {
            for (const e of input) {
                await prisma.positionBanner.update({ data: e, where: { id: e.id } })
            }

            return { state: "success" }
        } catch (e) {
            console.log(e)
            return { status: 500, message: e.message }
        }
    } // end editposition

    @Delete('deleteposition/:id')
    async deleteposition(@Param('id') id: string) {
        try {
            const idInt = parseInt(id)
            const res = await prisma.positionBanner.delete({ where: { id: idInt } })
            if (res.id !== undefined) {
                return { state: 'success' }
            }
            return { state: 'success' }
        } catch (e) {
            console.log(e)
            return { status: 500, message: e.message }
        }
    } // end deleteposition

}