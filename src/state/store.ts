import { createSignal, createEffect } from "solid-js"
import { SQLite, type Sort, type TableInfo, type ColumnInfo } from "../db/sqlite"

export type FocusMode = "sidebar" | "grid" | "row-detail"

export interface AppState {
  db: SQLite
  dbPath: string
  tables: () => TableInfo[]
  setTables: (tables: TableInfo[]) => void
  selectedTableIndex: () => number
  setSelectedTableIndex: (index: number) => void
  selectedTable: () => TableInfo | undefined
  columns: () => ColumnInfo[]
  setColumns: (columns: ColumnInfo[]) => void
  rows: () => any[]
  setRows: (rows: any[]) => void
  sort: () => Sort
  setSort: (sort: Sort) => void
  page: () => number
  setPage: (page: number) => void
  pageSize: () => number
  setPageSize: (size: number) => void
  totalCount: () => number | undefined
  setTotalCount: (count: number | undefined) => void
  loading: () => { tables: boolean; rows: boolean; count: boolean }
  setLoading: (loading: { tables: boolean; rows: boolean; count: boolean }) => void
  error: () => string | undefined
  setError: (error: string | undefined) => void
  focus: () => FocusMode
  setFocus: (focus: FocusMode) => void
  showSystemTables: () => boolean
  setShowSystemTables: (show: boolean) => void
  selectedRowIndex: () => number
  setSelectedRowIndex: (index: number) => void
}

export async function createStore(dbPath: string): Promise<AppState> {
  const db = new SQLite(dbPath)

  const [tables, setTables] = createSignal<TableInfo[]>([])
  const [selectedTableIndex, setSelectedTableIndex] = createSignal(0)
  const [columns, setColumns] = createSignal<ColumnInfo[]>([])
  const [rows, setRows] = createSignal<any[]>([])
  const [sort, setSort] = createSignal<Sort>({ dir: "ASC" })
  const [page, setPage] = createSignal(0)
  const [pageSize, setPageSize] = createSignal(20)
  const [totalCount, setTotalCount] = createSignal<number | undefined>(undefined)
  const [loading, setLoading] = createSignal({ tables: false, rows: false, count: false })
  const [error, setError] = createSignal<string | undefined>(undefined)
  const [focus, setFocus] = createSignal<FocusMode>("sidebar")
  const [showSystemTables, setShowSystemTables] = createSignal(false)
  const [selectedRowIndex, setSelectedRowIndex] = createSignal(0)

  const selectedTable = () => {
    const idx = selectedTableIndex()
    return tables()[idx]
  }

  const loadTables = () => {
    try {
      const tableList = db.listTables(!showSystemTables())
      setTables(tableList)
      setError(undefined)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  const loadTableData = () => {
    const table = selectedTable()
    if (!table) return

    try {
      const cols = db.tableInfo(table.name)
      setColumns(cols)
      
      const data = db.rows(table.name, sort(), pageSize(), page() * pageSize())
      setRows(data)
      setError(undefined)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  createEffect(() => {
    loadTables()
  })

  createEffect(() => {
    if (selectedTable()) {
      loadTableData()
    }
  })

  loadTables()

  return {
    db,
    dbPath,
    tables,
    setTables,
    selectedTableIndex,
    setSelectedTableIndex,
    selectedTable,
    columns,
    setColumns,
    rows,
    setRows,
    sort,
    setSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalCount,
    setTotalCount,
    loading,
    setLoading,
    error,
    setError,
    focus,
    setFocus,
    showSystemTables,
    setShowSystemTables,
    selectedRowIndex,
    setSelectedRowIndex,
  }
}
