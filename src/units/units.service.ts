import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm/expressions';
import { PG_CONNECTION } from '../constants';
import * as schema from 'src/drizzle/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';


@Injectable()
export class UnitsService {
  private readonly units = schema.units;
  private readonly properties = schema.properties;
  private readonly contacts = schema.contacts;

  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof schema>,
  ) {}


  async getAllUnits() {
    return this.db
      .select()
      .from(this.units)
      .leftJoin(this.properties, eq(this.units.locationId, this.properties.id))
      .leftJoin(schema.contacts, eq(this.units.ownerId, schema.contacts.id))
      .leftJoin(schema.leases, eq(this.units.unitId, schema.leases.unitId))
      .leftJoin(schema.tenants, eq(schema.leases.tenantId, schema.tenants.id))
      .execute();
  }

  async getUnitById(unitId: string) {
    const unit = await this.db.query.units.findFirst({
      where: (units, { eq }) => eq(units.unitId, unitId)
    });
    const location = await this.db.query.properties.findFirst({
      where: (properties, { eq }) => eq(properties.id, unit.locationId)
    });
    const leases = await this.db.query.leases.findFirst({
      where: (leases, { eq }) => eq(leases.unitId, unitId)
    });
    let tenant = null;
    if (leases) {
      tenant = await this.db.query.contacts.findFirst({
        where: (contacts, { eq }) => eq(this.contacts.id, leases.tenantId)
      });
    }
    const owner = await this.db.query.contacts.findFirst({
      where: (contacts, { eq }) => eq(contacts.id, unit.ownerId)
    });
    return {
      status: 'success',
      message: 'Unit fetched successfully',
      unit: {
        location,
        ...unit,
        leases: leases ?? null,
        tenant,
        owner
      }
    };
  } 

  async createUnit(unitDto: any) {
    const propertyDto = {
      id: Math.floor(Math.random() * 1000000),
      address: unitDto.address,
      ownerId: unitDto.ownerId,
      value: unitDto.value,
      mapUrl: unitDto.mapUrl
    };
    const existingProperty = await this.db.query.properties.findFirst({where: (properties, {eq}) => eq(properties.address, unitDto.address)});
    if(existingProperty) {
      throw new Error('Property already exists');
    }
    const ownerExists = await this.db.query.contacts.findFirst({where: (contacts, {eq}) => eq(contacts.id, unitDto.ownerId)});
    if (!ownerExists) {
      throw new Error('Owner does not exist');
    }
    const property = await this.db.insert(this.properties).values(propertyDto).returning().execute();
    unitDto.locationId = property[0].id;
    return this.db.insert(this.units).values({...unitDto, unitId: Math.floor(Math.random() * 1000000)}).returning().execute();
  }

  async updateUnit(unitId: string, unitDto: any) {
    return this.db
      .update(this.units)
      .set(unitDto)
      .where(eq(this.units.unitId, unitId))
      .execute();
  }

  async deleteUnit(unitId: string) {
    return this.db
      .delete(this.units)
      .where(eq(this.units.unitId, unitId))
      .execute();
  }
}
