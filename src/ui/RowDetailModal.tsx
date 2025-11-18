import { For, Show } from "solid-js"
import type { AppState } from "../state/store"
import { theme } from "../theme"

interface RowDetailModalProps {
  store: AppState
  onClose: () => void
}

export function RowDetailModal(props: RowDetailModalProps) {
  const currentRow = () => {
    const rows = props.store.rows()
    const index = props.store.selectedRowIndex()
    return rows[index]
  }

  const rowNumber = () => props.store.selectedRowIndex() + 1
  const totalRows = () => props.store.rows().length

  return (
    <box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={100}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <box
        width="80%"
        height="80%"
        border
        borderColor={theme.colors.accent}
        title={`Row ${rowNumber()} of ${totalRows()} - ${props.store.selectedTable()?.name || ""}`}
        titleAlignment="center"
        style={{
          backgroundColor: theme.colors.background,
          flexDirection: "column",
        }}
      >
        <box padding={1} borderBottom style={{ borderColor: theme.colors.textDim }}>
          <text style={{ fg: theme.colors.textDim }}>
            Press <b style={{ fg: theme.colors.accent }}>j/k</b> to navigate rows | <b style={{ fg: theme.colors.accent }}>Esc</b> to close
          </text>
        </box>

        <scrollbox
          stickyScroll={false}
          style={{
            flexGrow: 1,
            rootOptions: { backgroundColor: theme.colors.background, padding: 2 },
            scrollbarOptions: { showArrows: true },
          }}
        >
          <box flexDirection="column" gap={1}>
            <Show when={currentRow()}>
              <For each={props.store.columns()}>
                {(col) => {
                  const value = currentRow()[col.name]
                  const isNull = value === null || value === undefined
                  const displayValue = isNull ? "NULL" : String(value)

                  return (
                    <box flexDirection="column" gap={0}>
                      <box>
                        <text>
                          <b style={{ fg: theme.colors.accent }}>{col.name}</b>
                          <span style={{ fg: theme.colors.textDim }}> ({col.type || "unknown"})</span>
                        </text>
                      </box>
                      <box
                        padding={1}
                        backgroundColor={isNull ? theme.colors.gridRowEven : theme.colors.gridRowOdd}
                        style={{ marginBottom: 1 }}
                      >
                        <text
                          style={{
                            fg: isNull ? theme.colors.textDim : theme.colors.text,
                          }}
                        >
                          {displayValue}
                        </text>
                      </box>
                    </box>
                  )
                }}
              </For>
            </Show>
          </box>
        </scrollbox>
      </box>
    </box>
  )
}
