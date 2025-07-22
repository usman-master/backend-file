import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  description: text("description"),
  componentCount: integer("component_count").default(0).notNull(),
});

export const components = pgTable("components", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: integer("category_id").notNull(),
  html: text("html").notNull(),
  css: text("css").notNull(),
  js: text("js").notNull(),
  tags: text("tags").array(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  componentCount: true,
});

export const insertComponentSchema = createInsertSchema(components).omit({
  id: true,
  isActive: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export type InsertComponent = z.infer<typeof insertComponentSchema>;
export type Component = typeof components.$inferSelect;
