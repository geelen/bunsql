# bunsql

Fast terminal SQLite inspector powered by Bun and @opentui/solid.

## Features

- 🚀 **Instant startup** - Zero installation via `bunx`
- 📊 **Table browsing** - Navigate tables and views with ease
- 🔍 **Data inspection** - View and navigate table contents
- ⌨️ **Keyboard-driven** - Efficient terminal UI navigation
- 📄 **Pagination** - Handle large datasets smoothly
- 🎨 **Clean interface** - Minimal, focused design

## Usage

```bash
bunx bunsql path/to/database.db
```

## Keyboard Shortcuts

### Global
- `q` - Quit
- `Tab` - Switch focus between sidebar and grid
- `Esc` - Close modals (when implemented)

### Sidebar (Table List)
- `↑`/`↓` - Navigate tables
- `Enter` - Load selected table
- `/` - Toggle system tables visibility

### Data Grid
- `↑`/`↓` - Navigate rows
- `[` / `]` - Previous/Next page
- `PgUp` / `PgDn` - Previous/Next page
- `c` - Count total rows (lazy load)

## Coming Soon

- Row detail view (Enter to expand)
- Schema/index inspection (i key)
- Column sorting (s key)
- Help overlay (? key)
- Search/filtering

## Development

```bash
# Install dependencies
bun install

# Create test database
bun test-db.ts

# Run locally
./bin/bunsql test.db
```

## Requirements

- Bun >= 1.1.0

## License

MIT
