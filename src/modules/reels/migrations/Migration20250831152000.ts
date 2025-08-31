import { Migration } from '@mikro-orm/migrations';

export class Migration20250831152000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table if not exists "reel_like" (
      "id" text not null,
      "reel_id" text not null,
      "customer_id" text not null,
      "created_at" timestamptz not null default now(),
      constraint "reel_like_pkey" primary key ("id")
    );`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_like_reel_id" ON "reel_like" (reel_id);`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_like_customer_id" ON "reel_like" (customer_id);`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_reel_like_reel_customer" ON "reel_like" (reel_id, customer_id);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "reel_like" cascade;`);
  }
}
