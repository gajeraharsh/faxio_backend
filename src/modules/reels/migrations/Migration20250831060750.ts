import { Migration } from '@mikro-orm/migrations';

export class Migration20250831060750 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "reel" ("id" text not null, "product_id" text null, "blog_id" text null, "uploader_type" text check ("uploader_type" in ('admin', 'user')) not null default 'admin', "uploader_id" text null, "type" text check ("type" in ('video', 'image')) not null default 'image', "name" text not null, "hashtags" jsonb null, "thumbnail_url" text null, "video_url" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "reel_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_deleted_at" ON "reel" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "reel" cascade;`);
  }

}
