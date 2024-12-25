
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
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  async findAll() {
    const tenants = await this.tenantsService.getAllTenants();
    if (!tenants) {
        throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
      }
    return {
      status: 'success',
      message: 'Tenants fetched successfully',
      tenants: tenants,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const tenant = await this.tenantsService.getTenantById(id);
    if (!tenant) {
      throw new HttpException('Tenant not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      message: 'Tenant fetched successfully',
      tenant: tenant,
    };
  }

  @Post()
  async create(@Body() tenantDto: any) {
    const newTenant = await this.tenantsService.createTenant(tenantDto);
    if (!newTenant) {
        throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      message: 'Tenant created successfully',
      tenant: newTenant,
    };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() tenantDto: any) {
    const updatedTenant = await this.tenantsService.updateTenant(id, tenantDto);
    if (!updatedTenant) {
        throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
      }
    return {
      status: 'success',
      message: 'Tenant updated successfully',
      tenant: updatedTenant,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.tenantsService.deleteTenant(id);
    return {
      status: 'success',
      message: 'Tenant deleted successfully',
    };
  }
}