import { Migration } from '@mikro-orm/migrations';

export class Migration20250916130000 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "newsletter" ("id" text not null, "email" text not null, "customer_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "newsletter_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_newsletter_email" ON "newsletter" (lower(email)) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_newsletter_deleted_at" ON "newsletter" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "newsletter" cascade;`);
  }

}
