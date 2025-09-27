"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250916072534 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250916072534 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "newsletter" ("id" text not null, "email" text not null, "customer_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "newsletter_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_newsletter_deleted_at" ON "newsletter" (deleted_at) WHERE deleted_at IS NULL;`);
    }
    async down() {
        this.addSql(`drop table if exists "newsletter" cascade;`);
    }
}
exports.Migration20250916072534 = Migration20250916072534;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA5MTYwNzI1MzQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9uZXdzbGV0dGVyL21pZ3JhdGlvbnMvTWlncmF0aW9uMjAyNTA5MTYwNzI1MzQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0RBQWtEO0FBRWxELE1BQWEsdUJBQXdCLFNBQVEsc0JBQVM7SUFFM0MsS0FBSyxDQUFDLEVBQUU7UUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLGlTQUFpUyxDQUFDLENBQUM7UUFDL1MsSUFBSSxDQUFDLE1BQU0sQ0FBQywrR0FBK0csQ0FBQyxDQUFDO0lBQy9ILENBQUM7SUFFUSxLQUFLLENBQUMsSUFBSTtRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLDRDQUE0QyxDQUFDLENBQUM7SUFDNUQsQ0FBQztDQUVGO0FBWEQsMERBV0MifQ==