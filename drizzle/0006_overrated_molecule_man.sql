CREATE TABLE "revetalhagenmk2_event" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "revetalhagenmk2_event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(256),
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	"description" text,
	"author" text,
	"start" timestamp with time zone NOT NULL,
	"end" timestamp with time zone NOT NULL,
	"location" text,
	"image" text
);
--> statement-breakpoint
ALTER TABLE "revetalhagenmk2_event" ADD CONSTRAINT "revetalhagenmk2_event_author_user_id_fk" FOREIGN KEY ("author") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;