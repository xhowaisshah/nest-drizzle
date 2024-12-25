import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm/sql'; // Corrected import for sql
import * as schema from 'src/drizzle/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';

@Injectable()
export class DashboardService {
  private readonly contacts = schema.contacts;
  private readonly units = schema.units;
  private readonly leases = schema.leases;
  private readonly tenants = schema.tenants; // Added tenants reference

  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof schema>,
  ) {}

  async getDashboardData() {
    const unitStatus = await this.db
      .select({ status: this.units.status, count: sql`count(*)` })
      .from(this.units)
      .groupBy(this.units.status)
      .execute();

    const landlordSummary = await this.db
      .select({
        landlord: this.contacts.id,
        unitsOwned: sql`count(*)`,
        totalValue: sql`sum(CAST(value AS numeric))`,
      })
      .from(this.contacts)
      .innerJoin(this.units, eq(this.contacts.id, this.units.ownerId)) // Corrected reference
      .groupBy(this.contacts.id)
      .execute();

    const rentalIncomeSummary = await this.db
      .select({ totalIncome: sql`sum(CAST(value AS numeric))` })
      .from(this.units)
      .where(eq(this.units.status, 'occupied')) 
      .execute();

    return {
      unitStatus,
      landlordSummary,
      rentalIncomeSummary,
    };
  }
}
