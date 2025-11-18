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
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <box
        width="80%"
        height="80%"
        border
        borderColor={theme.colors.borderActive}
        backgroundColor={theme.colors.background}
        style={{
          flexDirection: "column",
        }}
      >
        <box 
          paddingLeft={1}
          paddingRight={1}
          borderBottom 
          backgroundColor={theme.colors.backgroundAlt}
          style={{ borderColor: theme.colors.border }}
        >
          <text style={{ fg: theme.colors.textDim }}>
            <span style={{ fg: theme.colors.text }}>{props.store.selectedTable()?.name || ""}</span>
            {" • "}
            Row {rowNumber()} of {totalRows()}
            {" • "}
            j/k navigate • Esc close
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
                  const isNum = !isNull && (typeof value === "number" || !isNaN(Number(value)))
                  const displayValue = isNull ? "NULL" : String(value)

                  return (
                    <box flexDirection="column">
                      <box paddingLeft={1} paddingTop={1}>
                        <text style={{ fg: theme.colors.textDim }}>
                          {col.name}
                        </text>
                      </box>
                      <box
                        paddingLeft={1}
                        paddingRight={1}
                        paddingBottom={1}
                        backgroundColor={theme.colors.backgroundAlt}
                      >
                        <text
                          style={{
                            fg: isNull 
                              ? theme.colors.null
                              : isNum
                              ? theme.colors.number
                              : theme.colors.textBright,
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
