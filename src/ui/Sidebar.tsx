import { For } from "solid-js"
import type { SelectRenderable } from "@opentui/core"
import type { AppState } from "../state/store"
import { theme } from "../theme"

interface SidebarProps {
  store: AppState
  focused: boolean
  onSelect: (index: number) => void
}

export function Sidebar(props: SidebarProps) {
  let selectRef: SelectRenderable | undefined

  return (
    <box
      width={30}
      border
      borderColor={props.focused ? theme.colors.borderActive : theme.colors.border}
      style={{
        backgroundColor: theme.colors.background,
        flexDirection: "column",
      }}
    >
      <select
        ref={(r) => (selectRef = r)}
        focused={props.focused}
        options={props.store.tables().map((t, i) => ({
          name: t.name,
          description: "",
          value: i,
        }))}
        onChange={(index) => {
          props.store.setSelectedTableIndex(index)
        }}
        onSelect={props.onSelect}
        selectedBackgroundColor={theme.colors.selected}
        selectedTextColor={theme.colors.textBright}
        showScrollIndicator={true}
        wrapSelection={true}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </box>
  )
}
