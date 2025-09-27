"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250831131200 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250831131200 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table "reel" add column if not exists "is_display_home" boolean not null default false;`);
    }
    async down() {
        this.addSql(`alter table "reel" drop column if exists "is_display_home";`);
    }
}
exports.Migration20250831131200 = Migration20250831131200;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTA4MzExMzEyMDAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9yZWVscy9taWdyYXRpb25zL01pZ3JhdGlvbjIwMjUwODMxMTMxMjAwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFrRDtBQUVsRCxNQUFhLHVCQUF3QixTQUFRLHNCQUFTO0lBQzNDLEtBQUssQ0FBQyxFQUFFO1FBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQywrRkFBK0YsQ0FBQyxDQUFDO0lBQy9HLENBQUM7SUFFUSxLQUFLLENBQUMsSUFBSTtRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLDZEQUE2RCxDQUFDLENBQUM7SUFDN0UsQ0FBQztDQUNGO0FBUkQsMERBUUMifQ==