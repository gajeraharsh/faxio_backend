import { Migration } from '@mikro-orm/migrations';

export class Migration20250829145020 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "blog" ("id" text not null, "category_id" text not null, "title" text not null, "image_url" text null, "short_description" text null, "content" text not null, "hashtags" jsonb null, "read_time" integer null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "blog_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_blog_deleted_at" ON "blog" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "blog_category" ("id" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "blog_category_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_blog_category_deleted_at" ON "blog_category" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "blog" cascade;`);

    this.addSql(`drop table if exists "blog_category" cascade;`);
  }

}
