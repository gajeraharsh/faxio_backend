"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250916135500 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250916135500 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "contact" (
      "id" text not null,
      "name" text not null,
      "email" text not null,
      "phone" text null,
      "subject" text not null,
      "message" text not null,
      "status" text not null default 'new',
      "created_at" timestamptz not null default now(),
      "updated_at" timestamptz not null default now(),
      "deleted_at" timestamptz null,
      constraint "contact_pkey" primary key ("id")
    );`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_contact_deleted_at" ON "contact" (deleted_at) WHERE deleted_at IS NULL;`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_contact_status" ON "contact" (status);`);
    }
    async down() {
        this.addSql(`drop table if exists "contact" cascade;`);
    }
}
exports.Migration20250916135500 = Migration20250916135500;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA5MTYxMzU1MDAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9jb250YWN0L21pZ3JhdGlvbnMvTWlncmF0aW9uMjAyNTA5MTYxMzU1MDAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0RBQWtEO0FBRWxELE1BQWEsdUJBQXdCLFNBQVEsc0JBQVM7SUFFM0MsS0FBSyxDQUFDLEVBQUU7UUFDZixJQUFJLENBQUMsTUFBTSxDQUFDOzs7Ozs7Ozs7Ozs7T0FZVCxDQUFDLENBQUM7UUFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLHlHQUF5RyxDQUFDLENBQUM7UUFDdkgsSUFBSSxDQUFDLE1BQU0sQ0FBQyx3RUFBd0UsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFFUSxLQUFLLENBQUMsSUFBSTtRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLHlDQUF5QyxDQUFDLENBQUM7SUFDekQsQ0FBQztDQUNGO0FBdkJELDBEQXVCQyJ9