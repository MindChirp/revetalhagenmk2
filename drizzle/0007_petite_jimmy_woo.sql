CREATE TABLE "revetalhagenmk2_eventMessage" (
	"id" integer PRIMARY KEY NOT NULL,
	"event" integer,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone,
	"content" text NOT NULL,
	"author" text
);
--> statement-breakpoint
ALTER TABLE "revetalhagenmk2_eventMessage" ADD CONSTRAINT "revetalhagenmk2_eventMessage_event_revetalhagenmk2_event_id_fk" FOREIGN KEY ("event") REFERENCES "public"."revetalhagenmk2_event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "revetalhagenmk2_eventMessage" ADD CONSTRAINT "revetalhagenmk2_eventMessage_author_user_id_fk" FOREIGN KEY ("author") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;