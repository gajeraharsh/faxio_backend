import { Pool } from "pg"

// Singleton Pool for external DB access (outside Medusa DI)
// Requires DATABASE_URL in env, e.g.:
// DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DB_NAME

let _pool: Pool | null = null

export function getPool(): Pool {
  if (!_pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL is not set. Please set it in your environment to use external Postgres connection."
      )
    }
    _pool = new Pool({ connectionString, max: 5 })
  }
  return _pool
}
