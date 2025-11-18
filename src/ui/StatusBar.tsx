import { Show } from "solid-js"
import type { AppState } from "../state/store"
import { theme } from "../theme"

interface StatusBarProps {
  store: AppState
}

export function StatusBar(props: StatusBarProps) {
  const getHints = () => {
    const focus = props.store.focus()
    if (focus === "sidebar") {
      return "↑/↓ Navigate | Enter Load | Tab Switch | / Toggle system | q Quit"
    } else if (focus === "grid") {
      return "↑/↓ Navigate | Enter Detail | c Count | [/] Page | Tab Switch | q Quit"
    } else if (focus === "row-detail") {
      return "j/k Navigate rows | Esc Close | q Quit"
    }
    return "Esc Close | q Quit"
  }

  return (
    <box
      height={3}
      border
      borderColor={theme.colors.border}
      padding={1}
      style={{
        backgroundColor: theme.colors.background,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <box flexGrow={1}>
        <text style={{ fg: theme.colors.textDim }}>
          {props.store.dbPath}
          <Show when={props.store.selectedTable()}>
            {" | "}
            <span style={{ fg: theme.colors.accent }}>
              {props.store.selectedTable()!.name}
            </span>
          </Show>
          <Show when={props.store.totalCount() !== undefined}>
            {" | "}
            {props.store.totalCount()} rows
          </Show>
          {" | Page "}
          {props.store.page() + 1}
          <Show when={props.store.sort().col}>
            {" | "}
            ↕ {props.store.sort().col} {props.store.sort().dir}
          </Show>
        </text>
      </box>
      <box>
        <text style={{ fg: theme.colors.textDim }}>{getHints()}</text>
      </box>
    </box>
  )
}
