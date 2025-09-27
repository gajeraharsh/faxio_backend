"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250829094659 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250829094659 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "customer_password_reset_token" ("id" text not null, "customer_id" text null, "email" text not null, "token_hash" text not null, "expires_at" timestamptz not null, "used_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_password_reset_token_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_password_reset_token_deleted_at" ON "customer_password_reset_token" (deleted_at) WHERE deleted_at IS NULL;`);
    }
    async down() {
        this.addSql(`drop table if exists "customer_password_reset_token" cascade;`);
    }
}
exports.Migration20250829094659 = Migration20250829094659;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA4MjkwOTQ2NTkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy92ZXJpZmljYXRpb24vbWlncmF0aW9ucy9NaWdyYXRpb24yMDI1MDgyOTA5NDY1OS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSx1QkFBd0IsU0FBUSxzQkFBUztJQUUzQyxLQUFLLENBQUMsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsa2FBQWthLENBQUMsQ0FBQztRQUNoYixJQUFJLENBQUMsTUFBTSxDQUFDLHFKQUFxSixDQUFDLENBQUM7SUFDckssQ0FBQztJQUVRLEtBQUssQ0FBQyxJQUFJO1FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsK0RBQStELENBQUMsQ0FBQztJQUMvRSxDQUFDO0NBRUY7QUFYRCwwREFXQyJ9