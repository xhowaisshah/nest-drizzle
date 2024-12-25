import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DashboardModule } from './dashboard/dashboard.module';
import { LeasesModule } from './leases/leases.module';
import { UnitsModule } from './units/units.module';
import { ContactsService } from './contacts/contacts.service';
import { ContactsController } from './contacts/contacts.controller';
import { UnitsController } from './units/units.controller';
import { LeasesController } from './leases/leases.controller';
import { DashboardController } from './dashboard/dashboard.controller';
import { UnitsService } from './units/units.service';
import { LeasesService } from './leases/leases.service';
import { DashboardService } from './dashboard/dashboard.service';
import { ContactModule } from './contacts/contacts.module';
import { TenantsModule } from './tenants/tenants.module';
import { TenantsController } from './tenants/tenants.controller';
import { TenantsService } from './tenants/tenants.service';

@Module({
  imports: [
    DrizzleModule,
    ContactModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UnitsModule,
    LeasesModule,
    DashboardModule,
    TenantsModule,
  ],
  controllers: [
    AppController,
    ContactsController,
    UnitsController,
    LeasesController,
    DashboardController,
    TenantsController
  ],
  providers: [
    AppService,
    ContactsService,
    UnitsService,
    LeasesService,
    DashboardService,
    TenantsService
  ],
})
export class AppModule {}
