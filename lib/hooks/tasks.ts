import { useQuery, queryCache, useMutation } from 'react-query'
import { Task } from 'components/Tasks'

export function useTasks(auth) {
  const { data, error, status } = useQuery<Task[], any>('tasks', () =>
    auth.get('/api/tasks')
  )
  const [creator] = useMutation<Task, { content }>(
    ({ content }) =>
      auth.put('/api/tasks', {
        content,
        completed: false,
      }),
    {
      onSuccess: (data) =>
        queryCache.refetchQueries(['tasks'], { exact: true }),
    }
  )
  const [deleter] = useMutation<Task, { _id }>(({ _id }) =>
    auth.delete('/api/tasks/' + _id)
  )
  const [completer] = useMutation<Task, Task>((task) =>
    auth.post('/api/tasks/' + task._id, {
      ...task,
      complete: !task.completed,
    })
  )

  return {
    data,
    error,
    status,
    creator,
    completer,
    deleter,
  }
}
