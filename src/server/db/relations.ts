import { relations } from "drizzle-orm";
import { news, user } from "./schema";

export const newsRelations = relations(news, ({ one }) => ({
  author: one(user, {
    fields: [news.author],
    references: [user.id],
  }),
}));
