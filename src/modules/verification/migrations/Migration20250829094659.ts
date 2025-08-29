import { Migration } from '@mikro-orm/migrations';

export class Migration20250829094659 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "customer_password_reset_token" ("id" text not null, "customer_id" text null, "email" text not null, "token_hash" text not null, "expires_at" timestamptz not null, "used_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_password_reset_token_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_password_reset_token_deleted_at" ON "customer_password_reset_token" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "customer_password_reset_token" cascade;`);
  }

}
