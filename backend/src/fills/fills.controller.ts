import { Controller } from '@nestjs/common';
import { FillsService } from './fills.service';
import { CreateFillDto } from './dto/create-fill.dto';
import { UpdateFillDto } from './dto/update-fill.dto';
import { TypedRoute, TypedBody, TypedParam, TypedQuery } from '@nestia/core';
import { QueryDTO } from './dto/query-fill.dto';

@Controller('fills')
export class FillsController {
  constructor(private readonly fillsService: FillsService) {}

  @TypedRoute.Post()
  create(@TypedBody<CreateFillDto>() createFillDto: CreateFillDto) {
    return this.fillsService.create(createFillDto);
  }

  @TypedRoute.Get()
  async findAll() {
    return await this.fillsService.findAll();
  }

  @TypedRoute.Get('/count')
  count() {
    return this.fillsService.count();
  }

  @TypedRoute.Get('pnl')
  async getPNL(@TypedQuery<QueryDTO>() query: QueryDTO) {
    return this.fillsService.getPNL(query);
  }

  @TypedRoute.Get(':id')
  findOne(@TypedParam('id') id: string) {
    return this.fillsService.findOne(+id);
  }

  @TypedRoute.Patch(':id')
  update(
    @TypedParam('id') id: string,
    @TypedBody<UpdateFillDto>() updateFillDto: UpdateFillDto,
  ) {
    return this.fillsService.update(+id, updateFillDto);
  }

  @TypedRoute.Delete(':id')
  remove(@TypedParam('id') id: string) {
    return this.fillsService.remove(+id);
  }
}
