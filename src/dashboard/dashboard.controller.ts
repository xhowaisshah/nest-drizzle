import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard() {
    const dashboardData = await this.dashboardService.getDashboardData();
    if (!dashboardData) {
      throw new HttpException('Dashboard data not found', HttpStatus.NOT_FOUND);
    }
    return {
      status: 'success',
      message: 'Dashboard data fetched successfully',
      data: dashboardData,
    };
  }
}
