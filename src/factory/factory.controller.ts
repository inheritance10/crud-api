// factory.controller.ts

import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards } from "@nestjs/common";
import { Factory } from './factory.model';
import { FactoryService } from "./factory.service";
import { JwtMiddleware } from "../middleware/jwt.middleware";

@Controller('factories')
@UseGuards(JwtMiddleware)
export class FactoryController {
  constructor(private readonly factoryService: FactoryService) {}

  @Get()
  async getAllFactories(): Promise<Factory[]> {
    return this.factoryService.getAllFactories();
  }

  @Get(':id')
  async getFactoryById(@Param('id') id: number): Promise<Factory> {
    return this.factoryService.getFactoryById(id);
  }

  @Post()
  async createFactory(@Body() factory: Factory): Promise<Factory> {
    return this.factoryService.createFactory(factory);
  }

  @Put(':id')
  async updateFactory(@Param('id') id: number, @Body() factory: Factory): Promise<Factory> {
    return this.factoryService.updateFactory(id, factory);
  }

  @Delete(':id')
  async deleteFactory(@Param('id') id: number): Promise<void> {
    return this.factoryService.deleteFactory(id);
  }
}
