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
import {
  ExampleDto,
  FindExampleDto,
  CreateExampleDto,
  UpdateExampleDto,
} from './dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Example')
@Controller('example')
export class ExampleController {
  constructor(private readonly userService: ExampleService) {}

  @Get()
  @ApiOperation({
    summary: 'Find example',
    description: 'example에서 원하는 데이터를 찾습니다.',
  })
  @ApiOkResponse({
    type: [ExampleDto],
    description: 'example 데이터 리스트를 출력합니다.',
  })
  async find(@Query() data: FindExampleDto) {
    return this.userService.find(data);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get example',
    description: 'example 데이터를 id를 이용하여 가져옵니다.',
  })
  @ApiOkResponse({
    type: ExampleDto,
    description: 'example 데이터를 출력합니다.',
  })
  async get(@Param('id') id: string) {
    return this.userService.get(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create example',
    description: 'example 데이터를 생성합니다.',
  })
  @ApiOkResponse({
    type: ExampleDto,
    description: 'example 데이터를 출력합니다.',
  })
  async create(@Body() data: CreateExampleDto) {
    return this.userService.create(data);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update example',
    description: 'example 데이터를 업데이트합니다.',
  })
  @ApiOkResponse({
    type: ExampleDto,
    description: 'example 데이터를 출력합니다.',
  })
  async update(@Param('id') id: string, @Body() data: UpdateExampleDto) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete example',
    description: 'example 데이터를 제거합니다.',
  })
  @ApiOkResponse({
    description: 'example 데이터를 제거한 후 OK 상태를 보냅니다.',
  })
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.userService.delete(id);
    return res.status(200).send();
  }
}
