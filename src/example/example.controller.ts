import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ExampleService } from './example.service';
import { FindExampleDto } from './dto/find-example.dto';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ExampleDto } from './dto/example.dto';
import { Response } from 'express';

@Controller('example')
export class ExampleController {
  constructor(private readonly userService: ExampleService) {}

  @Get()
  @ApiOperation({ summary: 'Find example', description: 'Find example' })
  @ApiOkResponse({ type: [ExampleDto], description: 'Result of examples' })
  async find(@Query() data: FindExampleDto) {
    return this.userService.find(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get example', description: 'Get example' })
  @ApiOkResponse({ type: ExampleDto, description: 'Result of example' })
  async get(@Param('id') id: string) {
    return this.userService.get(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create example', description: 'Create example' })
  @ApiOkResponse({ type: ExampleDto, description: 'Result of example' })
  async create(@Body() data: CreateExampleDto) {
    return this.userService.create(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update example', description: 'Update example' })
  @ApiOkResponse({ type: ExampleDto, description: 'Result of example' })
  async update(@Param('id') id: string, @Body() data: UpdateExampleDto) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete example', description: 'Delete example' })
  @ApiOkResponse({ description: 'Result of delete' })
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.userService.delete(id);
    return res.status(200).send();
  }
}
