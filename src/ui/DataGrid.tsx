import { For, Show } from "solid-js"
import type { AppState } from "../state/store"
import { theme } from "../theme"
import { formatCell, isNumeric, alignCell } from "../utils/format"

function isNumericValue(value: any): boolean {
  if (value === null || value === undefined) return false
  return typeof value === "number" || !isNaN(Number(value))
}

interface DataGridProps {
  store: AppState
  focused: boolean
}

export function DataGrid(props: DataGridProps) {
  const getColumnWidth = (colName: string, index: number) => {
    const rows = props.store.rows()
    const headerLen = colName.length
    const maxContentLen = rows.reduce((max, row) => {
      const val = row[colName]
      const len = String(val ?? "NULL").length
      return Math.max(max, len)
    }, 0)
    
    return Math.min(Math.max(headerLen, maxContentLen) + 2, 30)
  }

  return (
    <box
      flexGrow={1}
      border
      borderColor={props.focused ? theme.colors.borderActive : theme.colors.border}
      style={{
        backgroundColor: theme.colors.background,
        flexDirection: "column",
      }}
    >
      <Show when={props.store.rows().length > 0} fallback={
        <box padding={2}>
          <text style={{ fg: theme.colors.textDim }}>
            {props.store.loading().rows ? "Loading..." : "No data"}
          </text>
        </box>
      }>
        <scrollbox
          stickyScroll={false}
          style={{
            flexGrow: 1,
            rootOptions: { backgroundColor: theme.colors.background },
            scrollbarOptions: { showArrows: true },
          }}
        >
          <box flexDirection="column">
            <box
              flexDirection="row"
              backgroundColor={theme.colors.backgroundAlt}
              paddingLeft={1}
              paddingRight={1}
              borderBottom
              style={{ borderColor: theme.colors.border }}
            >
              <For each={props.store.columns()}>
                {(col) => {
                  const width = getColumnWidth(col.name, col.cid)
                  return (
                    <box width={width} paddingRight={1}>
                      <text style={{ fg: theme.colors.textDim }}>
                        {col.name}
                      </text>
                    </box>
                  )
                }}
              </For>
            </box>

            <For each={props.store.rows()}>
              {(row, idx) => (
                  <box
                    flexDirection="row"
                    backgroundColor={
                      idx() === props.store.selectedRowIndex() && props.focused
                        ? theme.colors.selected
                        : theme.colors.background
                    }
                    paddingLeft={1}
                    paddingRight={1}
                  >
                    <For each={props.store.columns()}>
                      {(col) => {
                        const width = getColumnWidth(col.name, col.cid)
                        const value = row[col.name]
                        const isNull = value === null || value === undefined
                        const isNum = isNumericValue(value)
                        const formatted = formatCell(value, width - 2)
                        
                        return (
                          <box width={width} paddingRight={1}>
                            <text
                              style={{
                                fg: isNull 
                                  ? theme.colors.null 
                                  : isNum 
                                  ? theme.colors.number 
                                  : theme.colors.string,
                              }}
                            >
                              {formatted}
                            </text>
                          </box>
                        )
                      }}
                    </For>
                  </box>
              )}
            </For>
          </box>
        </scrollbox>
      </Show>
    </box>
  )
}
