"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250916130000 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250916130000 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "newsletter" ("id" text not null, "email" text not null, "customer_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "newsletter_pkey" primary key ("id"));`);
        this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_newsletter_email" ON "newsletter" (lower(email)) WHERE deleted_at IS NULL;`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_newsletter_deleted_at" ON "newsletter" (deleted_at) WHERE deleted_at IS NULL;`);
    }
    async down() {
        this.addSql(`drop table if exists "newsletter" cascade;`);
    }
}
exports.Migration20250916130000 = Migration20250916130000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA5MTYxMzAwMDAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9uZXdzbGV0dGVyL21pZ3JhdGlvbnMvTWlncmF0aW9uMjAyNTA5MTYxMzAwMDAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0RBQWtEO0FBRWxELE1BQWEsdUJBQXdCLFNBQVEsc0JBQVM7SUFFM0MsS0FBSyxDQUFDLEVBQUU7UUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLGlTQUFpUyxDQUFDLENBQUM7UUFDL1MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrSEFBa0gsQ0FBQyxDQUFDO1FBQ2hJLElBQUksQ0FBQyxNQUFNLENBQUMsK0dBQStHLENBQUMsQ0FBQztJQUMvSCxDQUFDO0lBRVEsS0FBSyxDQUFDLElBQUk7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO0lBQzVELENBQUM7Q0FFRjtBQVpELDBEQVlDIn0=