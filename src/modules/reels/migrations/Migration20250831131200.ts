import { Migration } from '@mikro-orm/migrations';

export class Migration20250831131200 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "reel" add column if not exists "is_display_home" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "reel" drop column if exists "is_display_home";`);
  }
}
