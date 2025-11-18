import { For, Show } from "solid-js"
import type { AppState } from "../state/store"
import { theme } from "../theme"
import { formatCell, isNumeric, alignCell } from "../utils/format"

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
      borderColor={props.focused ? theme.colors.accent : theme.colors.textDim}
      title={props.store.selectedTable()?.name || "No table selected"}
      titleAlignment="center"
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
          focused={props.focused}
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
              backgroundColor={theme.colors.gridHeader}
              padding={1}
            >
              <For each={props.store.columns()}>
                {(col) => {
                  const width = getColumnWidth(col.name, col.cid)
                  return (
                    <box width={width} paddingRight={1}>
                      <text>
                        <b style={{ fg: theme.colors.accent }}>{col.name}</b>
                      </text>
                    </box>
                  )
                }}
              </For>
            </box>

            <For each={props.store.rows()}>
              {(row, idx) => {
                const isSelected = idx() === props.store.selectedRowIndex()
                return (
                  <box
                    flexDirection="row"
                    backgroundColor={
                      isSelected && props.focused
                        ? theme.colors.selected
                        : idx() % 2 === 0
                        ? theme.colors.gridRowEven
                        : theme.colors.gridRowOdd
                    }
                    padding={1}
                  >
                    <For each={props.store.columns()}>
                      {(col) => {
                        const width = getColumnWidth(col.name, col.cid)
                        const value = row[col.name]
                        const isNull = value === null || value === undefined
                        const formatted = formatCell(value, width - 2)
                        
                        return (
                          <box width={width} paddingRight={1}>
                            <text
                              style={{
                                fg: isNull ? theme.colors.textDim : theme.colors.text,
                              }}
                            >
                              {formatted}
                            </text>
                          </box>
                        )
                      }}
                    </For>
                  </box>
                )
              }}
            </For>
          </box>
        </scrollbox>
      </Show>
    </box>
  )
}
