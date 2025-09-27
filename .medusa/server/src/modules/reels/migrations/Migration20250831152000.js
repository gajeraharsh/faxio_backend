"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250831152000 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250831152000 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "reel_like" (
      "id" text not null,
      "reel_id" text not null,
      "customer_id" text not null,
      "created_at" timestamptz not null default now(),
      constraint "reel_like_pkey" primary key ("id")
    );`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_like_reel_id" ON "reel_like" (reel_id);`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_reel_like_customer_id" ON "reel_like" (customer_id);`);
        this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_reel_like_reel_customer" ON "reel_like" (reel_id, customer_id);`);
    }
    async down() {
        this.addSql(`drop table if exists "reel_like" cascade;`);
    }
}
exports.Migration20250831152000 = Migration20250831152000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA4MzExNTIwMDAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9yZWVscy9taWdyYXRpb25zL01pZ3JhdGlvbjIwMjUwODMxMTUyMDAwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFrRDtBQUVsRCxNQUFhLHVCQUF3QixTQUFRLHNCQUFTO0lBQzNDLEtBQUssQ0FBQyxFQUFFO1FBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7Ozs7O09BTVQsQ0FBQyxDQUFDO1FBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyw4RUFBOEUsQ0FBQyxDQUFDO1FBQzVGLElBQUksQ0FBQyxNQUFNLENBQUMsc0ZBQXNGLENBQUMsQ0FBQztRQUNwRyxJQUFJLENBQUMsTUFBTSxDQUFDLHVHQUF1RyxDQUFDLENBQUM7SUFDdkgsQ0FBQztJQUVRLEtBQUssQ0FBQyxJQUFJO1FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsMkNBQTJDLENBQUMsQ0FBQztJQUMzRCxDQUFDO0NBQ0Y7QUFqQkQsMERBaUJDIn0=