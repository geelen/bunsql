import { Database } from "bun:sqlite"

export type Sort = { col?: string; dir: "ASC" | "DESC" }

export function quoteIdent(name: string): string {
  return `"${name.replace(/"/g, '""')}"`
}

export interface TableInfo {
  name: string
  type: string
}

export interface ColumnInfo {
  cid: number
  name: string
  type: string
  notnull: number
  dflt_value: any
  pk: number
}

export interface IndexInfo {
  seq: number
  name: string
  unique: number
  origin: string
  partial: number
}

export class SQLite {
  public db: Database

  constructor(public dbPath: string) {
    this.db = new Database(dbPath, { readonly: true })
  }

  listTables(hideSystem = true): TableInfo[] {
    const where = hideSystem ? "AND name NOT LIKE 'sqlite_%'" : ""
    return this.db
      .query(
        `SELECT name, type FROM sqlite_master WHERE type IN ('table','view') ${where} ORDER BY name`
      )
      .all() as TableInfo[]
  }

  tableInfo(table: string): ColumnInfo[] {
    return this.db.query(`PRAGMA table_info(${quoteIdent(table)})`).all() as ColumnInfo[]
  }

  indexList(table: string): IndexInfo[] {
    return this.db.query(`PRAGMA index_list(${quoteIdent(table)})`).all() as IndexInfo[]
  }

  createSQL(name: string): string | undefined {
    const result = this.db
      .query(
        `SELECT sql FROM sqlite_master WHERE name = ? AND type IN ('table','view')`
      )
      .get(name) as { sql?: string } | undefined
    return result?.sql
  }

  count(table: string): number {
    const result = this.db.query(`SELECT COUNT(*) as c FROM ${quoteIdent(table)}`).get() as {
      c: number
    }
    return result.c
  }

  rows(table: string, sort: Sort, limit: number, offset: number): any[] {
    let order = ""
    if (sort.col) {
      order = ` ORDER BY ${quoteIdent(sort.col)} ${sort.dir}`
    } else {
      order = ` ORDER BY rowid`
    }
    const sql = `SELECT * FROM ${quoteIdent(table)}${order} LIMIT ? OFFSET ?`
    try {
      return this.db.query(sql).all(limit, offset) as any[]
    } catch (e) {
      const sql2 = `SELECT * FROM ${quoteIdent(table)} LIMIT ? OFFSET ?`
      return this.db.query(sql2).all(limit, offset) as any[]
    }
  }

  close() {
    this.db.close()
  }
}
