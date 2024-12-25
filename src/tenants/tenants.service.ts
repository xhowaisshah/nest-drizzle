import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm/expressions';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import * as schema from 'src/drizzle/schema';

@Injectable()
export class TenantsService {
  private readonly tenants = schema.tenants;
  private readonly contacts = schema.contacts;

  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof schema>,
  ) {}

  async getAllTenants() {
    return this.db
      .select()
      .from(this.contacts)
      .where(eq(this.contacts.contactUserType, 'tanent'))
      .execute();
  }

  async getTenantById(id: number) {
    return this.db
      .select()
      .from(this.tenants)
      .where(eq(this.tenants.id, id))
      .execute();
  }

  async createTenant(tenantDto: any) {
    try {
      const contactResult = await this.db
        .insert(this.contacts)
        .values({
            id: Math.floor(Math.random() * 1000000),
            ...tenantDto,
            contactUserType: 'tanent'
          })
        .returning()
        .execute();

      const tenantData = {
        ...tenantDto,
        id: contactResult[0].id,
      };
       
      await this.db
        .insert(this.tenants)
        .values(tenantData)
        .returning()
        .execute();
      return  contactResult[0]
    } catch (error) {
      throw new Error(`Failed to create tenant: ${error.message}`);
    }
  }

  async updateTenant(id: number, tenantDto: any) {
    return this.db
      .update(this.tenants)
      .set(tenantDto)
      .where(eq(this.tenants.id, id))
      .execute();
  }

  async deleteTenant(id: number) {
    return this.db
      .delete(this.tenants)
      .where(eq(this.tenants.id, id))
      .execute();
  }
}