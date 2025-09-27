"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250831095515 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250831095515 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "reel_like" ("id" text not null, "reel_id" text not null, "customer_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "reel_like_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_like_deleted_at" ON "reel_like" (deleted_at) WHERE deleted_at IS NULL;`);
    }
    async down() {
        this.addSql(`drop table if exists "reel_like" cascade;`);
    }
}
exports.Migration20250831095515 = Migration20250831095515;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA4MzEwOTU1MTUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9yZWVscy9taWdyYXRpb25zL01pZ3JhdGlvbjIwMjUwODMxMDk1NTE1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFrRDtBQUVsRCxNQUFhLHVCQUF3QixTQUFRLHNCQUFTO0lBRTNDLEtBQUssQ0FBQyxFQUFFO1FBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxU0FBcVMsQ0FBQyxDQUFDO1FBQ25ULElBQUksQ0FBQyxNQUFNLENBQUMsNkdBQTZHLENBQUMsQ0FBQztJQUM3SCxDQUFDO0lBRVEsS0FBSyxDQUFDLElBQUk7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0lBQzNELENBQUM7Q0FFRjtBQVhELDBEQVdDIn0=