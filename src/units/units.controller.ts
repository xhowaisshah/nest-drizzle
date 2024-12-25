import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UnitsService } from './units.service';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  async findAll() {
    const units = await this.unitsService.getAllUnits();
    return {
      status: 'success',
      message: 'Units fetched successfully',
      units: units,
    };
  }

  @Get(':id')
  async findOne(@Param('id') unitId: string) {
    const unit = await this.unitsService.getUnitById(unitId);
    if (!unit) {
      throw new HttpException('Unit not found', HttpStatus.NOT_FOUND);
    }
    return unit;
  }

  @Post()
  async create(@Body() unitDto: any) {
    const newUnit = await this.unitsService.createUnit(unitDto);
    return {
      status: 'success',
      message: 'Unit created successfully',
      unit: newUnit,
    };
  }

  @Put(':id')
  async update(@Param('id') unitId: string, @Body() unitDto: any) {
    const updatedUnit = await this.unitsService.updateUnit(unitId, unitDto);
    if (!updatedUnit.rowCount) {
      throw new HttpException('Unit not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      message: 'Unit updated successfully',
      unit: updatedUnit,
    };
  }

  @Delete(':id')
  async delete(@Param('id') unitId: string) {
    const result = await this.unitsService.deleteUnit(unitId);
    if (!result.rowCount) {
      throw new HttpException('Unit not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      message: 'Unit deleted successfully',
    };
  }
}