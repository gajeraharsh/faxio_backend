"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250916084845 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250916084845 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "contact" ("id" text not null, "name" text not null, "email" text not null, "phone" text null, "subject" text not null, "message" text not null, "status" text check ("status" in ('new', 'in_progress', 'resolved')) not null default 'new', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "contact_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_contact_deleted_at" ON "contact" (deleted_at) WHERE deleted_at IS NULL;`);
    }
    async down() {
        this.addSql(`drop table if exists "contact" cascade;`);
    }
}
exports.Migration20250916084845 = Migration20250916084845;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA5MTYwODQ4NDUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9jb250YWN0L21pZ3JhdGlvbnMvTWlncmF0aW9uMjAyNTA5MTYwODQ4NDUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0RBQWtEO0FBRWxELE1BQWEsdUJBQXdCLFNBQVEsc0JBQVM7SUFFM0MsS0FBSyxDQUFDLEVBQUU7UUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLDBiQUEwYixDQUFDLENBQUM7UUFDeGMsSUFBSSxDQUFDLE1BQU0sQ0FBQyx5R0FBeUcsQ0FBQyxDQUFDO0lBQ3pILENBQUM7SUFFUSxLQUFLLENBQUMsSUFBSTtRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLHlDQUF5QyxDQUFDLENBQUM7SUFDekQsQ0FBQztDQUVGO0FBWEQsMERBV0MifQ==