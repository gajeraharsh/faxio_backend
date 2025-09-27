"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250829142500 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250829142500 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "blog_category" ("id" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "blog_category_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_blog_category_deleted_at" ON "blog_category" (deleted_at) WHERE deleted_at IS NULL;`);
        this.addSql(`create table if not exists "blog" ("id" text not null, "category_id" text not null, "title" text not null, "image_url" text null, "short_description" text null, "content" text not null, "hashtags" jsonb null, "read_time" integer null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "blog_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_blog_deleted_at" ON "blog" (deleted_at) WHERE deleted_at IS NULL;`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_blog_category_id" ON "blog" (category_id);`);
    }
    async down() {
        this.addSql(`drop table if exists "blog" cascade;`);
        this.addSql(`drop table if exists "blog_category" cascade;`);
    }
}
exports.Migration20250829142500 = Migration20250829142500;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA4MjkxNDI1MDAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9ibG9nL21pZ3JhdGlvbnMvTWlncmF0aW9uMjAyNTA4MjkxNDI1MDAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0RBQWtEO0FBRWxELE1BQWEsdUJBQXdCLFNBQVEsc0JBQVM7SUFFM0MsS0FBSyxDQUFDLEVBQUU7UUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLDZRQUE2USxDQUFDLENBQUM7UUFDM1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxSEFBcUgsQ0FBQyxDQUFDO1FBRW5JLElBQUksQ0FBQyxNQUFNLENBQUMseVpBQXlaLENBQUMsQ0FBQztRQUN2YSxJQUFJLENBQUMsTUFBTSxDQUFDLG1HQUFtRyxDQUFDLENBQUM7UUFDakgsSUFBSSxDQUFDLE1BQU0sQ0FBQyw0RUFBNEUsQ0FBQyxDQUFDO0lBQzVGLENBQUM7SUFFUSxLQUFLLENBQUMsSUFBSTtRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLE1BQU0sQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBQy9ELENBQUM7Q0FFRjtBQWhCRCwwREFnQkMifQ==