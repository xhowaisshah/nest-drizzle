import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  providers: [DashboardService],
  imports: [DrizzleModule],
  controllers: [DashboardController]
})
export class DashboardModule {}
