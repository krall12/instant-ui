import { useParams } from '@remix-run/react'
import { useQuery } from '@tanstack/react-query'
import { idb } from '~/utils/dexie.client'

export default function TaskId() {
  const params = useParams()

  const { data: todo } = useQuery({
    queryKey: ['todo', params.taskId],
    queryFn: async ({ queryKey: [, taskId] }) => {
      console.time('get todo')
      const todo = await idb.todos.get(taskId!)
      console.timeEnd('get todo')
      return todo
    },
  })

  return (
    <div>
      <h1 className="text-xl">{todo?.title}</h1>
      <p>{todo?.body}</p>
    </div>
  )
}
