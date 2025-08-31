import { Migration } from '@mikro-orm/migrations';

export class Migration20250831095515 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "reel_like" ("id" text not null, "reel_id" text not null, "customer_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "reel_like_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_like_deleted_at" ON "reel_like" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "reel_like" cascade;`);
  }

}
