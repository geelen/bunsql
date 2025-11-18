import { createSignal, Show } from "solid-js"
import { useKeyboard, useRenderer } from "@opentui/solid"
import type { AppState } from "../state/store"
import { Sidebar } from "./Sidebar"
import { DataGrid } from "./DataGrid"
import { StatusBar } from "./StatusBar"
import { RowDetailModal } from "./RowDetailModal"
import { theme } from "../theme"

interface AppLayoutProps {
  store: AppState
}

export function AppLayout(props: AppLayoutProps) {
  const renderer = useRenderer()

  useKeyboard((key) => {
    if (key.name === "q" && !key.ctrl) {
      renderer.stop()
      props.store.db.close()
      process.exit(0)
    }

    if (key.name === "escape") {
      if (props.store.focus() === "row-detail") {
        props.store.setFocus("grid")
      }
      return
    }

    if (key.name === "tab") {
      const current = props.store.focus()
      if (current === "sidebar") {
        props.store.setFocus("grid")
        props.store.setSelectedColumnIndex(0)
      } else if (current === "grid") {
        props.store.setFocus("sidebar")
      }
      return
    }

    if (key.name === "left") {
      const current = props.store.focus()
      if (current === "grid") {
        const colIndex = props.store.selectedColumnIndex()
        if (colIndex > 0) {
          props.store.setSelectedColumnIndex(colIndex - 1)
        } else {
          props.store.setFocus("sidebar")
        }
      }
      return
    }

    if (key.name === "right") {
      const current = props.store.focus()
      if (current === "sidebar") {
        props.store.setFocus("grid")
        props.store.setSelectedColumnIndex(0)
      } else if (current === "grid") {
        const maxIndex = props.store.columns().length - 1
        const colIndex = props.store.selectedColumnIndex()
        if (colIndex < maxIndex) {
          props.store.setSelectedColumnIndex(colIndex + 1)
        }
      }
      return
    }

    if (props.store.focus() === "sidebar") {
      if (key.name === "slash") {
        props.store.setShowSystemTables(!props.store.showSystemTables())
      }
    }

    if (props.store.focus() === "grid") {
      if (key.name === "return") {
        if (props.store.rows().length > 0) {
          props.store.setFocus("row-detail")
        }
      }

      if (key.name === "s") {
        const columns = props.store.columns()
        const colIndex = props.store.selectedColumnIndex()
        const selectedCol = columns[colIndex]
        if (selectedCol) {
          const currentSort = props.store.sort()
          if (currentSort.col === selectedCol.name) {
            if (currentSort.dir === "ASC") {
              props.store.setSort({ col: selectedCol.name, dir: "DESC" })
            } else {
              props.store.setSort({ col: undefined, dir: "ASC" })
            }
          } else {
            props.store.setSort({ col: selectedCol.name, dir: "ASC" })
          }
        }
      }

      if (key.name === "c") {
        try {
          const table = props.store.selectedTable()
          if (table) {
            const count = props.store.db.count(table.name)
            props.store.setTotalCount(count)
          }
        } catch (e) {
          props.store.setError(e instanceof Error ? e.message : String(e))
        }
      }

      if (key.name === "left_square_bracket" || key.name === "page_up") {
        const currentPage = props.store.page()
        if (currentPage > 0) {
          props.store.setPage(currentPage - 1)
        }
      }

      if (key.name === "right_square_bracket" || key.name === "page_down") {
        props.store.setPage(props.store.page() + 1)
      }

      if (key.name === "up") {
        const current = props.store.selectedRowIndex()
        if (current > 0) {
          props.store.setSelectedRowIndex(current - 1)
        }
      }

      if (key.name === "down") {
        const current = props.store.selectedRowIndex()
        const maxIndex = props.store.rows().length - 1
        if (current < maxIndex) {
          props.store.setSelectedRowIndex(current + 1)
        }
      }
    }

    if (props.store.focus() === "row-detail") {
      if (key.name === "j" || key.name === "down") {
        const current = props.store.selectedRowIndex()
        const maxIndex = props.store.rows().length - 1
        if (current < maxIndex) {
          props.store.setSelectedRowIndex(current + 1)
        }
      }

      if (key.name === "k" || key.name === "up") {
        const current = props.store.selectedRowIndex()
        if (current > 0) {
          props.store.setSelectedRowIndex(current - 1)
        }
      }
    }
  })

  return (
    <box
      width="100%"
      height="100%"
      flexDirection="column"
      backgroundColor={theme.colors.background}
    >
      <box flexGrow={1} flexDirection="row">
        <Sidebar
          store={props.store}
          focused={props.store.focus() === "sidebar"}
          onSelect={(index) => {
            props.store.setSelectedTableIndex(index)
            props.store.setFocus("grid")
            props.store.setSelectedColumnIndex(0)
          }}
        />
        <DataGrid store={props.store} focused={props.store.focus() === "grid"} />
      </box>
      <StatusBar store={props.store} />
      
      <Show when={props.store.focus() === "row-detail"}>
        <RowDetailModal
          store={props.store}
          onClose={() => props.store.setFocus("grid")}
        />
      </Show>
    </box>
  )
}
