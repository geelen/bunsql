import { render } from "@opentui/solid"
import { createStore } from "./state/store"
import { AppLayout } from "./ui/AppLayout"

export async function start(dbPath: string) {
  const store = await createStore(dbPath)
  
  render(() => <AppLayout store={store} />, {
    targetFps: 30,
  })
}
