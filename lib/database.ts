import type { D1Database } from "workers"

export interface Env {
  DB: D1Database
}

export function getDatabase(): D1Database {
  // In production, this would come from the environment
  return (globalThis as any).DB as D1Database
}

// Database helper functions
export async function executeQuery(db: D1Database, query: string, params: any[] = []) {
  try {
    const result = await db
      .prepare(query)
      .bind(...params)
      .run()
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function fetchOne(db: D1Database, query: string, params: any[] = []) {
  try {
    const result = await db
      .prepare(query)
      .bind(...params)
      .first()
    return result
  } catch (error) {
    console.error("Database fetch error:", error)
    throw error
  }
}

export async function fetchAll(db: D1Database, query: string, params: any[] = []) {
  try {
    const result = await db
      .prepare(query)
      .bind(...params)
      .all()
    return result.results
  } catch (error) {
    console.error("Database fetch error:", error)
    throw error
  }
}
