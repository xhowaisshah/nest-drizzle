import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  providers: [UnitsService],
  imports: [DrizzleModule],
  controllers: [UnitsController],
})
export class UnitsModule {}
