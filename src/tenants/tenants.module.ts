
import { Module } from '@nestjs/common';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';

@Module({
  providers: [TenantsService],
  imports: [DrizzleModule],
  controllers: [TenantsController],
})
export class TenantsModule {}