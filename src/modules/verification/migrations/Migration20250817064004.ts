import { Migration } from '@mikro-orm/migrations';

export class Migration20250817064004 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "customer_email_verification" ("id" text not null, "customer_id" text null, "email" text not null, "code" text not null, "expires_at" timestamptz not null, "consumed_at" timestamptz null, "verified" boolean not null default false, "verified_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_email_verification_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_email_verification_deleted_at" ON "customer_email_verification" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "customer_email_verification" cascade;`);
  }

}
