import { Migration } from '@mikro-orm/migrations';

export class Migration20250817160526 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "wishlist_item" ("id" text not null, "product_id" text not null, "customer_id" text not null, "notes" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "wishlist_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_wishlist_item_deleted_at" ON "wishlist_item" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "wishlist_item" cascade;`);
  }

}
