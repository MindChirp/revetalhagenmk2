// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTableCreator,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `revetalhagenmk2_${name}`);

/**
 * This is not used
 */
export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 256 }),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);

/**
 * The following tables are used for managing events
 */

export const event = createTable("event", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  title: d.varchar({ length: 256 }),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  description: d.text(),
  author: d.text().references(() => user.id, { onDelete: "set null" }),
  start: d.timestamp({ withTimezone: true }).notNull(),
  end: d.timestamp({ withTimezone: true }).notNull(),
  preview: d.text(),
  location: d.text(),
  image: d.text(),
}));

export const eventMessage = createTable("eventMessage", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  event: d.integer().references(() => event.id, { onDelete: "cascade" }),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  content: d.text().notNull(),
  author: d.text().references(() => user.id, { onDelete: "set null" }),
  replyTo: d
    .integer()
    .references((): AnyPgColumn => eventMessage.id, { onDelete: "set null" }),
}));

/**
 * The following tables are used for managing news articles
 */

export const news = createTable("news", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 256 }),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  content: d.text().notNull(),
  author: d.text().references(() => user.id, { onDelete: "set null" }),
  views: d.integer().default(0),
  preview: d.text(),
}));

export const newsRelations = relations(news, ({ one }) => ({
  author: one(user, {
    fields: [news.author],
    references: [user.id],
  }),
}));

/**
 * This table is used for general page content that is not tied to a specific
 * route. It can be used for static pages like "About Us", "Contact", etc.
 * It is designed to store content in a structured format that can be easily
 * rendered on the frontend.
 */
export const pageContent = createTable("pageContent", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  order: d.integer().notNull().default(0),
  slug: d.varchar(),
  content: d
    .json()
    .$type<
      Record<string, unknown> & {
        title: string;
        image?: string;
        content: string;
      }
    >()
    .notNull(),
}));

/**
 * The following tables are used for managing items that can be booked.
 */
export const itemType = createTable("itemType", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 256 }),
}));

export const item = createTable("item", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 256 }),
  type: d.integer().references(() => itemType.id, { onDelete: "set null" }),
  price: d.integer().notNull().default(0),
  personPrice: d.integer().notNull().default(0),
  memberDiscount: d.doublePrecision().notNull().default(0),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  description: d.text(),
  image: d.text(),
}));

export const itemMeta = createTable("itemMeta", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  icon: d.text(),
  label: d.varchar({ length: 256 }),
  item: d.integer().references(() => item.id, { onDelete: "cascade" }),
}));

export const BookingStates = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "rejected",
] as const;

export const bookingStatusEnum = pgEnum("bookingStatus", BookingStates);

export const booking = createTable("booking", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  reference: d.uuid().defaultRandom().notNull(),
  item: d.integer().references(() => item.id, { onDelete: "cascade" }),
  // user: d.text().references(() => user.id, { onDelete: "set null" }),
  email: d.varchar({ length: 256 }),
  name: d.varchar({ length: 256 }).notNull(),
  personCount: d.integer(),
  phone: d.varchar({ length: 32 }),
  from: d.timestamp({ withTimezone: true }).notNull(),
  rejectionReason: d.text(),
  to: d.timestamp({ withTimezone: true }).notNull(),
  price: d.integer().notNull().default(0),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  status: bookingStatusEnum().notNull().default("pending"),
  message: d.text(),
}));

export const newsletterSubscription = createTable(
  "newsletterSubscription",
  (d) => ({
    email: d.varchar({ length: 256 }).primaryKey(),
  }),
);

export const itemRelations = relations(item, ({ one, many }) => ({
  bookings: one(booking, {
    fields: [item.id],
    references: [booking.item],
    relationName: "itemBookings",
  }),
  itemMeta: many(itemMeta),
}));

export const itemMetaRelations = relations(itemMeta, ({ one }) => ({
  item: one(item, {
    fields: [itemMeta.item],
    references: [item.id],
  }),
}));

export const bookingRelations = relations(booking, ({ one }) => ({
  item: one(item, {
    fields: [booking.item],
    references: [item.id],
    relationName: "bookingItem",
  }),
}));

export * from "./auth-schema";
// export * from "./relations";
