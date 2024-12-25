import { text, pgTable, integer, date, varchar, pgEnum, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const contactTypeEnum = pgEnum('contact_type', ['email', 'phone', 'whatsapp']);

export const contactUserTypeEnum = pgEnum('contact_user_type', ['owner', 'tanent', 'manager', 'agent', 'other']);

export const unitTypeEnum = pgEnum('unit_type', [
  'apartment',
  'house',
  'commercial',
  'industrial',
  'studio',
  'condo',
  'townhouse',
  'villa',
  'bungalow',
  'loft',
  'penthouse',
  'duplex',
  'triplex',
  'quadplex'
]);

export const unitStatusEnum = pgEnum('unit_status', ['available', 'occupied', 'under_maintenance', 'vacant']);

export const billingStatusEnum = pgEnum('billing_status', ['paid', 'pending']);

export const leaseDurationEnum = pgEnum('lease_duration', ['monthly', 'quarterly', 'yearly', 'other']);


export const contacts = pgTable('contacts', {
  id: integer('id').notNull().primaryKey(),
  name: text('name').notNull(),
  contactType: contactTypeEnum('contact_type').notNull(),
  contactUserType: contactUserTypeEnum('contact_user_type').notNull(),
  contactInformation: text('contact_information').notNull(),
  createdAt: timestamp('created_at').default(sql`now()`).notNull()
});

export const tenants = pgTable('tenants', {
  id: integer('id').notNull().primaryKey().references(() => contacts.id),
  name: text('name').notNull(),
  contactInformation: text('contact_information').notNull(),
  createdAt: timestamp('created_at').default(sql`now()`).notNull()
});

export const properties = pgTable('properties', {
  id: integer('id').notNull().primaryKey(),
  address: text('address').notNull().unique(),
  ownerId: integer('owner_id').notNull().references(() => contacts.id),
  value: text('value').notNull(),
  mapUrl: text('map_url'),
  createdAt: timestamp('created_at').default(sql`now()`).notNull()
});

export const units = pgTable('units', {
  unitId: text('unit_id').notNull().primaryKey(),
  unitType: unitTypeEnum('unit_type').notNull(),
  ownerId: integer('owner_id').notNull().references(() => contacts.id),
  locationId: integer('location_id').notNull().references(() => properties.id),
  value: text('value').notNull(),
  status: unitStatusEnum('unit_status').notNull(),
  size: text('size').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  amenities: text('amenities').array().default(sql`ARRAY[]::text[]`),
  description: text('description'),
  images: text('images').array().default(sql`ARRAY[]::text[]`),
  createdAt: timestamp('created_at').default(sql`now()`).notNull()
});

export const leases = pgTable('leases', {
  leaseId: integer('lease_id').notNull().primaryKey(), // Ensure leaseId is unique
  unitId: varchar('unit_id').notNull().references(() => units.unitId),
  tenantId: integer('tenant_id').notNull().references(() => contacts.id),
  amount: varchar('amount').notNull(),
  duration: leaseDurationEnum('lease_duration').notNull(),
  paymentSchedule: varchar('payment_schedule').notNull(),
  startDate: varchar('start_date').notNull(),
  endDate: varchar('end_date').notNull(),
  billingDate: varchar('billing_date').notNull(),
});

export const billing = pgTable('billing', {
  billingId: integer('billing_id').notNull().primaryKey(),
  leaseId: integer('lease_id').notNull().references(() => leases.leaseId),
  tenantId: integer('tenant_id').notNull().references(() => contacts.id),
  amountDue: text('amount_due').notNull(),
  dueDate: date('due_date').notNull(),
  status: billingStatusEnum('billing_status').notNull(),
  createdAt: timestamp('created_at').default(sql`now()`).notNull()
});

export const users = pgTable('users', {
  userId: integer('user_id').notNull().primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').default(sql`now()`).notNull()
});

export const roles = pgTable('roles', {
  roleId: integer('role_id').notNull().primaryKey(),
  roleName: text('role_name').notNull().unique(),
  createdAt: timestamp('created_at').default(sql`now()`).notNull()
});

export const userRoles = pgTable('user_roles', {
  userId: integer('user_id').notNull().references(() => users.userId),
  roleId: integer('role_id').notNull().references(() => roles.roleId),
  createdAt: timestamp('created_at').default(sql`now()`).notNull()
});

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  ownedProperties: many(properties),
  ownedUnits: many(units),
  leases: many(leases),
  billings: many(billing)
}));

export const unitsRelations = relations(units, ({ one, many }) => ({
  owner: one(contacts),
  location: one(properties),
  leases: many(leases)
}));

export const leasesRelations = relations(leases, ({ one, many }) => ({
  unit: one(units),
  tenant: one(tenants),
  billings: many(billing)
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  owner: one(contacts),
  units: many(units)
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users),
  role: one(roles)
}));
