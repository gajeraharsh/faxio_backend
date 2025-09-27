"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250816154251 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250816154251 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "review" ("id" text not null, "product_id" text not null, "customer_id" text null, "title" text null, "content" text not null, "rating" integer not null, "first_name" text not null, "last_name" text not null, "status" text check ("status" in ('pending', 'approved', 'rejected')) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "review_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_review_deleted_at" ON "review" (deleted_at) WHERE deleted_at IS NULL;`);
    }
    async down() {
        this.addSql(`drop table if exists "review" cascade;`);
    }
}
exports.Migration20250816154251 = Migration20250816154251;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA4MTYxNTQyNTEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9yZXZpZXcvbWlncmF0aW9ucy9NaWdyYXRpb24yMDI1MDgxNjE1NDI1MS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSx1QkFBd0IsU0FBUSxzQkFBUztJQUUzQyxLQUFLLENBQUMsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsNGVBQTRlLENBQUMsQ0FBQztRQUMxZixJQUFJLENBQUMsTUFBTSxDQUFDLHVHQUF1RyxDQUFDLENBQUM7SUFDdkgsQ0FBQztJQUVRLEtBQUssQ0FBQyxJQUFJO1FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsd0NBQXdDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0NBRUY7QUFYRCwwREFXQyJ9