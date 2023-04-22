import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { prisma } from '~/server/prisma.server'

export let loader = async ({ request }: LoaderArgs) => {
  const todos = await prisma.todo.findMany()
  return json({ todos })
}

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Todos' }]
}

export default function Index() {
  const { todos } = useLoaderData<typeof loader>()

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1 className="text-xl border-b mb-4">Todos</h1>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center">
            <input type="checkbox" checked={todo.completed} readOnly />

            <Link to={todo.id} className="ml-2 hover:underline">
              <span>{todo.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
