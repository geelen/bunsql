import { Database } from "bun:sqlite"

const db = new Database("test.db")

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

db.run(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    content TEXT,
    published BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )
`)

for (let i = 1; i <= 50; i++) {
  db.run(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    `User ${i}`,
    `user${i}@example.com`
  )
}

for (let i = 1; i <= 100; i++) {
  const userId = Math.floor(Math.random() * 50) + 1
  db.run(
    "INSERT INTO posts (user_id, title, content, published) VALUES (?, ?, ?, ?)",
    userId,
    `Post ${i}`,
    `This is the content of post ${i}. It has some text to demonstrate truncation and detail views.`,
    Math.random() > 0.5 ? 1 : 0
  )
}

db.close()
console.log("Test database created: test.db")
