ALTER TABLE "revetalhagenmk2_news" RENAME COLUMN "user_id" TO "author";--> statement-breakpoint
ALTER TABLE "revetalhagenmk2_news" DROP CONSTRAINT "revetalhagenmk2_news_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "revetalhagenmk2_news" ADD CONSTRAINT "revetalhagenmk2_news_author_user_id_fk" FOREIGN KEY ("author") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;