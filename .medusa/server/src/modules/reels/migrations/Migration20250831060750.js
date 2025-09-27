"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250831060750 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250831060750 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "reel" ("id" text not null, "product_id" text null, "blog_id" text null, "uploader_type" text check ("uploader_type" in ('admin', 'user')) not null default 'admin', "uploader_id" text null, "type" text check ("type" in ('video', 'image')) not null default 'image', "name" text not null, "hashtags" jsonb null, "thumbnail_url" text null, "video_url" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "reel_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_deleted_at" ON "reel" (deleted_at) WHERE deleted_at IS NULL;`);
    }
    async down() {
        this.addSql(`drop table if exists "reel" cascade;`);
    }
}
exports.Migration20250831060750 = Migration20250831060750;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA4MzEwNjA3NTAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9yZWVscy9taWdyYXRpb25zL01pZ3JhdGlvbjIwMjUwODMxMDYwNzUwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFrRDtBQUVsRCxNQUFhLHVCQUF3QixTQUFRLHNCQUFTO0lBRTNDLEtBQUssQ0FBQyxFQUFFO1FBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpakJBQWlqQixDQUFDLENBQUM7UUFDL2pCLElBQUksQ0FBQyxNQUFNLENBQUMsbUdBQW1HLENBQUMsQ0FBQztJQUNuSCxDQUFDO0lBRVEsS0FBSyxDQUFDLElBQUk7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0lBQ3RELENBQUM7Q0FFRjtBQVhELDBEQVdDIn0=