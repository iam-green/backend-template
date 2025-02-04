import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ExampleService } from './example.service';
import {
  CreateExampleDto,
  FindExampleDto,
  UpdateExampleDto,
} from './type/example';

@Controller('example')
export class ExampleController {
  constructor(private readonly userService: ExampleService) {}

  @Get()
  async find(@Query() data: FindExampleDto) {
    return this.userService.find(data);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.userService.get(id);
  }

  @Post()
  async create(@Body() data: CreateExampleDto) {
    return this.userService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateExampleDto) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
