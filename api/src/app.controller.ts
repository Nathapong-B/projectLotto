import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("api/app")
export class AppController {
  // constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  private items = [
    { id: 1, name: 'item one' },
    { id: 2, name: 'item two' },
    { id: 3, name: 'item three' }
  ]

  @Get()
  getallitems() {
    return this.items;
  }

  @Get(":id")
  getitem(@Param("id") id: string) {
    const itemId = parseInt(id);
    //const item = this.items.find((i) => i.id === itemId);
    const item = this.items.find(e => e.id === itemId);
    return item ? item : 'item not found';
  }

  @Post()
  createitem(@Body() newItem: { name: string }) {
    const newId = this.items.length + 1;
    const newRecode = { id: newId, name: newItem.name };

    this.items.push(newRecode);

    return newRecode;
  }

  @Put(":id")
  updateitem(@Param("id") id: string, @Body() newName: { name: string }) {
    const itemId = parseInt(id);
    const myIndex = this.items.findIndex((i) => i.id === itemId);

    if (myIndex !== -1) {
      this.items[myIndex].name = newName.name;
      return this.items[myIndex];
    }
    return "Id not found";
  }

  @Delete(":id")
  deleteitem(@Param("id") id: string) {
    const itemId = parseInt(id);
    const myIndex = this.items.findIndex((i) => i.id === itemId);

    if (myIndex !== -1) {
      return this.items.splice(myIndex, 1);
    }
    return "Id not found";
  }

}
