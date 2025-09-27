"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250831110000 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250831110000 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "reel" (
      "id" text not null,
      "product_id" text null,
      "blog_id" text null,
      "uploader_type" text not null default 'admin',
      "uploader_id" text null,
      "type" text not null default 'image',
      "name" text not null,
      "hashtags" jsonb null,
      "thumbnail_url" text null,
      "video_url" text null,
      "created_at" timestamptz not null default now(),
      "updated_at" timestamptz not null default now(),
      "deleted_at" timestamptz null,
      constraint "reel_pkey" primary key ("id")
    );`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_deleted_at" ON "reel" (deleted_at) WHERE deleted_at IS NULL;`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_type" ON "reel" (type);`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_product_id" ON "reel" (product_id);`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_blog_id" ON "reel" (blog_id);`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_uploader_type" ON "reel" (uploader_type);`);
    }
    async down() {
        this.addSql(`drop table if exists "reel" cascade;`);
    }
}
exports.Migration20250831110000 = Migration20250831110000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA4MzExMTAwMDAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9yZWVscy9taWdyYXRpb25zL01pZ3JhdGlvbjIwMjUwODMxMTEwMDAwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFrRDtBQUVsRCxNQUFhLHVCQUF3QixTQUFRLHNCQUFTO0lBRTNDLEtBQUssQ0FBQyxFQUFFO1FBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O09BZVQsQ0FBQyxDQUFDO1FBRUwsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtR0FBbUcsQ0FBQyxDQUFDO1FBQ2pILElBQUksQ0FBQyxNQUFNLENBQUMsOERBQThELENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsTUFBTSxDQUFDLDBFQUEwRSxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvRUFBb0UsQ0FBQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxNQUFNLENBQUMsZ0ZBQWdGLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBRVEsS0FBSyxDQUFDLElBQUk7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0lBQ3RELENBQUM7Q0FDRjtBQTlCRCwwREE4QkMifQ==