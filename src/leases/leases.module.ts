import { Module } from '@nestjs/common';
import { LeasesService } from './leases.service';
import { LeasesController } from './leases.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  providers: [LeasesService],
  imports: [DrizzleModule],
  controllers: [LeasesController],
})
export class LeasesModule {}
