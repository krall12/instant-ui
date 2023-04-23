import type { Todo, User } from '@prisma/client'
import Dexie from 'dexie'

type AppMetadata = {
  key: string
  value: boolean | string
}

class AppDatabase extends Dexie {
  app_metadata!: Dexie.Table<AppMetadata, number>
  user!: Dexie.Table<User, string>
  todos!: Dexie.Table<Pick<Todo, 'id' | 'title' | 'body' | 'completed'>, string>

  constructor() {
    super('AppDatabase')

    this.version(1).stores({
      app_metadata: 'key, value',
      user: 'id, name, email',
      todos: 'id, title, body, completed',
    })
  }
}

export const idb = new AppDatabase()

export async function seedIDB() {
  const seeded = await idb.app_metadata.get({ key: 'seeded' })
  const todos = (await fetch('/api/seed-todos').then((res) => res.json())) as Todo[]

  if (!seeded) {
    // seed the database
    await idb.todos.bulkPut(
      todos.map((todo) => ({ id: todo.id, title: todo.title, body: todo.body, completed: todo.completed }))
    )

    // update the seed flag
    await idb.app_metadata.put({ key: 'seeded', value: true })
  }
}
