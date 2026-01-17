CREATE TABLE IF NOT EXISTS "answer_choices" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"choice_letter" varchar(1) NOT NULL,
	"choice_text" text NOT NULL,
	"is_correct" boolean NOT NULL,
	"explanation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "passages" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"content" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"difficulty" varchar(50) NOT NULL,
	"estimated_time" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "practice_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"passage_id" integer NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"timed_session" boolean NOT NULL,
	"time_spent" integer,
	"score" integer,
	"total_questions" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"passage_id" integer NOT NULL,
	"question_number" integer NOT NULL,
	"question_text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"question_id" integer NOT NULL,
	"selected_choice_id" integer,
	"is_flagged" boolean DEFAULT false NOT NULL,
	"is_correct" boolean,
	"answered_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"total_sessions" integer DEFAULT 0 NOT NULL,
	"total_questions_answered" integer DEFAULT 0 NOT NULL,
	"total_correct" integer DEFAULT 0 NOT NULL,
	"average_score" numeric(5, 2) DEFAULT '0' NOT NULL,
	"total_time_spent" integer DEFAULT 0 NOT NULL,
	"last_practice_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_progress_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer_choices" ADD CONSTRAINT "answer_choices_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "practice_sessions" ADD CONSTRAINT "practice_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "practice_sessions" ADD CONSTRAINT "practice_sessions_passage_id_passages_id_fk" FOREIGN KEY ("passage_id") REFERENCES "passages"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_passage_id_passages_id_fk" FOREIGN KEY ("passage_id") REFERENCES "passages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_answers" ADD CONSTRAINT "session_answers_session_id_practice_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "practice_sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_answers" ADD CONSTRAINT "session_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session_answers" ADD CONSTRAINT "session_answers_selected_choice_id_answer_choices_id_fk" FOREIGN KEY ("selected_choice_id") REFERENCES "answer_choices"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
