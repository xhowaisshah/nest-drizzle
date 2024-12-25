import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm/expressions';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PG_CONNECTION } from '../constants';
import * as schema from 'src/drizzle/schema';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import { contactUserTypeEnum } from 'src/drizzle/schema';

@Injectable()
export class ContactsService {
  private readonly contacts = schema.contacts;

  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof schema>,
  ) {}

  async getAllContacts() {
    return this.db.query.contacts.findMany();
  }

  async getContactById(id: number) {
    return this.db.query.contacts.findFirst({
      where: (contacts, { eq }) => eq(contacts.id, id),
    });
  }

  async getContactsByType(type: typeof contactUserTypeEnum['enumValues'][number]) {
    return this.db.query.contacts.findMany({
      where: (contacts, { eq }) => eq(contacts.contactUserType, type),
    });
  }

  async createContact(contactDto: any) {
    const newId = Math.floor(Math.random() * 1000000); 
    const result = await this.db.insert(this.contacts).values({...contactDto, id: newId}).returning().execute();
    return {
      status: 'success',
      message: 'Contact created successfully',
      contact: result,
    };
  }

  async updateContact(id: number, contactDto: any) {
    return this.db
      .update(this.contacts)
      .set(contactDto)
      .where(eq(this.contacts.id, id))
      .execute();
  }

  async deleteContact(id: number) {
    return this.db
      .delete(this.contacts)
      .where(eq(this.contacts.id, id))
      .execute();
  }
}
