CREATE TABLE "revetalhagenmk2_pageContent" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "revetalhagenmk2_pageContent_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"order" integer DEFAULT 0 NOT NULL,
	"slug" varchar,
	"content" json NOT NULL
);
