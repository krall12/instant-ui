import type { V2_MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { idb, seedIDB } from '~/utils/dexie.client'

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Todos' }]
}

export default function Index() {
  const queryClient = useQueryClient()
  const [limit, setLimit] = useState<number | string>(50)
  const [orderBy, setOrderBy] = useState<'asc' | 'desc'>('asc')

  const { data: todos = [] } = useQuery({
    queryKey: ['todos', orderBy, limit],
    queryFn: async ({ queryKey: [, orderBy, limit] }) => {
      let todos = []
      console.time('get todos')
      if (orderBy === 'asc') {
        todos = await idb.todos
          .orderBy('id')
          .limit(+limit)
          .toArray()
      } else {
        todos = await idb.todos
          .orderBy('id')
          .reverse()
          .limit(+limit)
          .toArray()
      }
      console.timeEnd('get todos')

      return todos
    },
  })

  useEffect(() => {
    // seedIDB()
  }, [])

  const mutation = useMutation({
    mutationFn: async (changes: { todoId: string; flip: boolean }) => {
      await idb.todos.update(changes.todoId, { completed: changes.flip })
      queryClient.invalidateQueries(['todos'])
    },
  })

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1 className="text-xl border-b mb-4">Todos</h1>

      <div className="flex items-center space-x-4 border-b pb-2 mb-4">
        <input type="number" value={String(limit)} onChange={(e) => setLimit(+e.target.value)} />

        <button
          onClick={() => {
            idb.delete()
          }}
        >
          Delete
        </button>

        <button onClick={() => setOrderBy((o) => (o === 'asc' ? 'desc' : 'asc'))}>
          Ordering by: {orderBy}
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={(e) => {
                mutation.mutate({ todoId: todo.id, flip: !todo.completed })
              }}
            />

            <Link to={'/todo/' + todo.id} className="ml-2 hover:underline">
              <span>{todo.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
