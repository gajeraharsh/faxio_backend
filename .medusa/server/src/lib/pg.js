"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPool = getPool;
const pg_1 = require("pg");
// Singleton Pool for external DB access (outside Medusa DI)
// Requires DATABASE_URL in env, e.g.:
// DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DB_NAME
let _pool = null;
function getPool() {
    if (!_pool) {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error("DATABASE_URL is not set. Please set it in your environment to use external Postgres connection.");
        }
        _pool = new pg_1.Pool({ connectionString, max: 5,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }
    return _pool;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3BnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBUUEsMEJBZUM7QUF2QkQsMkJBQXlCO0FBRXpCLDREQUE0RDtBQUM1RCxzQ0FBc0M7QUFDdEMsMERBQTBEO0FBRTFELElBQUksS0FBSyxHQUFnQixJQUFJLENBQUE7QUFFN0IsU0FBZ0IsT0FBTztJQUNyQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDWCxNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFBO1FBQ2pELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQ2IsaUdBQWlHLENBQ2xHLENBQUE7UUFDSCxDQUFDO1FBQ0QsS0FBSyxHQUFHLElBQUksU0FBSSxDQUFDLEVBQUUsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDekMsR0FBRyxFQUFDO2dCQUNGLGtCQUFrQixFQUFDLEtBQUs7YUFDekI7U0FDRCxDQUFDLENBQUE7SUFDTCxDQUFDO0lBQ0QsT0FBTyxLQUFLLENBQUE7QUFDZCxDQUFDIn0=