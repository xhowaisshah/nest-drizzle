import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm/expressions';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PG_CONNECTION } from '../constants';
import * as schema from 'src/drizzle/schema';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';

@Injectable()
export class LeasesService {
  private readonly leases = schema.leases;
  private readonly units = schema.units;
  private readonly tenants = schema.tenants;

  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof schema>,
  ) { }

  async getAllLeases() {
    return this.db.select().from(this.leases).execute();
  }

  async getLeaseById(id: number) {
    return this.db
      .select()
      .from(this.leases)
      .where(eq(this.leases.leaseId, id)) // Use 'id' instead of 'leaseId'
      .execute();
  }

  async createLease(leaseDto: CreateLeaseDto) {
    const id = Math.floor(Math.random() * 1000000); // Generate an integer ID
  
    // Insert the lease into the database and fetch the newly created lease details along with related information
    const newLease = await this.db
      .insert(this.leases)
      .values({
        leaseId: id,
        amount: leaseDto.amount.toString(), // Ensure amount is a string
        startDate: new Date(leaseDto.startDate).toISOString(), // Convert Date to string
        endDate: new Date(leaseDto.endDate).toISOString(), // Convert Date to string
        unitId: leaseDto.unitId,
        duration: leaseDto.duration,
        tenantId: leaseDto.tenantId,
        paymentSchedule: leaseDto.paymentSchedule,
        billingDate: new Date(leaseDto.billingDate).toISOString(), // Convert Date to string
      })
      .returning()
      .execute()
      .then(() => this.db
        .select()
        .from(this.leases)
        .leftJoin(this.units, eq(this.leases.unitId, this.units.unitId))
        .leftJoin(this.tenants, eq(this.leases.tenantId, this.tenants.id))
        .where(eq(this.leases.leaseId, id))
        .execute()
      )

      await this.db.update(this.units).set({ status: 'occupied' }).where(eq(this.units.unitId, leaseDto.unitId)).execute()
  
    if (!newLease || newLease.length === 0) {
      throw new Error('Failed to fetch newly created lease details');
    }
  
    const lease = newLease[0];
    console.log(lease)
    return {
      leaseId: lease.leases.leaseId,
      unit: {
        unitId: lease.units.unitId,
        unitType: lease.units.unitType,
        value: lease.units.value,
        status: lease.units.status,
      },

      duration: lease.leases.duration,
      paymentSchedule: lease.leases.paymentSchedule,
      amount: lease.leases.amount,
      billingDate: lease.leases.billingDate,
      startDate: lease.leases.startDate, // Corrected field
      endDate: lease.leases.endDate, // Corrected field
    }
  }

  async updateLease(id: number, leaseDto: any) {
    return this.db
      .update(this.leases)
      .set(leaseDto)
      .where(eq(this.leases.leaseId, id)) // Use 'id' instead of 'leaseId'
      .execute();
  }

  async deleteLease(id: number) {
    return this.db
      .delete(this.leases)
      .where(eq(this.leases.leaseId, id)) // Use 'id' instead of 'leaseId'
      .execute();
  }
}
