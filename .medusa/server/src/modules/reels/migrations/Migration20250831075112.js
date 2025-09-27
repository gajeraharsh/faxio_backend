"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250831075112 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250831075112 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table if exists "reel" add column if not exists "is_display_home" boolean not null default false;`);
    }
    async down() {
        this.addSql(`alter table if exists "reel" drop column if exists "is_display_home";`);
    }
}
exports.Migration20250831075112 = Migration20250831075112;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA4MzEwNzUxMTIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9yZWVscy9taWdyYXRpb25zL01pZ3JhdGlvbjIwMjUwODMxMDc1MTEyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFrRDtBQUVsRCxNQUFhLHVCQUF3QixTQUFRLHNCQUFTO0lBRTNDLEtBQUssQ0FBQyxFQUFFO1FBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyx5R0FBeUcsQ0FBQyxDQUFDO0lBQ3pILENBQUM7SUFFUSxLQUFLLENBQUMsSUFBSTtRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLHVFQUF1RSxDQUFDLENBQUM7SUFDdkYsQ0FBQztDQUVGO0FBVkQsMERBVUMifQ==