import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { prisma } from '~/server/prisma.server'

export let loader = async ({ request }: LoaderArgs) => {
  const todos = await prisma.todo.findMany()
  return json(todos)
}
