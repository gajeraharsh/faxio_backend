"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250817064004 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250817064004 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "customer_email_verification" ("id" text not null, "customer_id" text null, "email" text not null, "code" text not null, "expires_at" timestamptz not null, "consumed_at" timestamptz null, "verified" boolean not null default false, "verified_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "customer_email_verification_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_customer_email_verification_deleted_at" ON "customer_email_verification" (deleted_at) WHERE deleted_at IS NULL;`);
    }
    async down() {
        this.addSql(`drop table if exists "customer_email_verification" cascade;`);
    }
}
exports.Migration20250817064004 = Migration20250817064004;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA4MTcwNjQwMDQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy92ZXJpZmljYXRpb24vbWlncmF0aW9ucy9NaWdyYXRpb24yMDI1MDgxNzA2NDAwNC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSx1QkFBd0IsU0FBUSxzQkFBUztJQUUzQyxLQUFLLENBQUMsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsdWVBQXVlLENBQUMsQ0FBQztRQUNyZixJQUFJLENBQUMsTUFBTSxDQUFDLGlKQUFpSixDQUFDLENBQUM7SUFDakssQ0FBQztJQUVRLEtBQUssQ0FBQyxJQUFJO1FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsNkRBQTZELENBQUMsQ0FBQztJQUM3RSxDQUFDO0NBRUY7QUFYRCwwREFXQyJ9