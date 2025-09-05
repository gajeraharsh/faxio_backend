import { Migration } from '@mikro-orm/migrations';

export class Migration20250831075112 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "reel" add column if not exists "is_display_home" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "reel" drop column if exists "is_display_home";`);
  }

}
