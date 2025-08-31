import { Migration } from '@mikro-orm/migrations';

export class Migration20250831110000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "reel" (
      "id" text not null,
      "product_id" text null,
      "blog_id" text null,
      "uploader_type" text not null default 'admin',
      "uploader_id" text null,
      "type" text not null default 'image',
      "name" text not null,
      "hashtags" jsonb null,
      "thumbnail_url" text null,
      "video_url" text null,
      "created_at" timestamptz not null default now(),
      "updated_at" timestamptz not null default now(),
      "deleted_at" timestamptz null,
      constraint "reel_pkey" primary key ("id")
    );`);

    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_deleted_at" ON "reel" (deleted_at) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_type" ON "reel" (type);`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_product_id" ON "reel" (product_id);`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_blog_id" ON "reel" (blog_id);`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_uploader_type" ON "reel" (uploader_type);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "reel" cascade;`);
  }
}
