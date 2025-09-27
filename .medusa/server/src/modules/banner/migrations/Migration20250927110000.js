"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250927110000 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250927110000 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "banner" ("id" text not null, "name" text not null, "desktop_image_url" text null, "mobile_image_url" text null, "link_url" text null, "position" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "banner_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_banner_deleted_at" ON "banner" (deleted_at) WHERE deleted_at IS NULL;`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_banner_position" ON "banner" (position) WHERE deleted_at IS NULL;`);
    }
    async down() {
        this.addSql(`drop table if exists "banner" cascade;`);
    }
}
exports.Migration20250927110000 = Migration20250927110000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA5MjcxMTAwMDAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9iYW5uZXIvbWlncmF0aW9ucy9NaWdyYXRpb24yMDI1MDkyNzExMDAwMC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSx1QkFBd0IsU0FBUSxzQkFBUztJQUUzQyxLQUFLLENBQUMsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLENBQUMseVhBQXlYLENBQUMsQ0FBQztRQUN2WSxJQUFJLENBQUMsTUFBTSxDQUFDLHVHQUF1RyxDQUFDLENBQUM7UUFDckgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtR0FBbUcsQ0FBQyxDQUFDO0lBQ25ILENBQUM7SUFFUSxLQUFLLENBQUMsSUFBSTtRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7SUFDeEQsQ0FBQztDQUVGO0FBWkQsMERBWUMifQ==