import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LeasesService } from './leases.service';

@Controller('leases')
export class LeasesController {
  constructor(private readonly leasesService: LeasesService) {}

  @Get()
  async findAll() {
    const leases = await this.leasesService.getAllLeases();
    return {
      status: 'success',
      message: 'Leases fetched successfully',
      leases: leases,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (isNaN(parseInt(id))) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }
    const lease = await this.leasesService.getLeaseById(parseInt(id));
    if (!lease) {
      throw new HttpException('Lease not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      message: 'Lease fetched successfully',
      lease: lease,
    };
  }

  @Post()
  async create(@Body() leaseDto: any) {
    const newLease = await this.leasesService.createLease(leaseDto);
    return {
      status: 'success',
      message: 'Lease created successfully',
      lease: newLease,
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() leaseDto: any) {
    const updatedLease = await this.leasesService.updateLease(parseInt(id), leaseDto);
    if (!updatedLease) {
      throw new HttpException('Lease not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      message: 'Lease updated successfully',
      lease: updatedLease,
    };
  }
}
