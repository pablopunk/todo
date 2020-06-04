import React from 'react'
import uniqueStr from 'unique-string'
import { useQuery, useMutation, queryCache } from 'react-query'
import useMagicLink from 'use-magic-link'
import { FoldingCube as Spinner } from 'better-react-spinkit'
import { AuthRequest } from 'lib/api'

interface IProps {
  token: string
  initialData?: any
}

export type Task = { _id: string; content: string; completed: boolean }

export default ({ token, initialData }: IProps) => {
  const auth = new AuthRequest(token)
  const { data, error, status } = useQuery<Task[], any>('tasks', () =>
    auth.get('/api/tasks')
  )
  const [newTaskText, newTaskTextSet] = React.useState('')
  const [taskCreator] = useMutation<Task, { content }>(
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
  const [taskDeleter] = useMutation<Task, { _id }>(({ _id }) =>
    auth.delete('/api/tasks/' + _id)
  )
  const [taskCompleter] = useMutation<Task, Task>((task) =>
    auth.post('/api/tasks/' + task._id, {
      ...task,
      complete: !task.completed,
    })
  )

  if (status === 'error') {
    console.log(error)
    return <span className="error-fg">Error fetching tasks</span>
  }

  if (status === 'loading') {
    return <Spinner className="accent-fg" />
  }

  const handleNewTask = async () => {
    if (newTaskText) {
      newTaskTextSet('')
      const mockTask = { content: newTaskText, mock: true }
      queryCache.setQueryData('tasks', [...data, mockTask])
      taskCreator(mockTask)
    }
  }

  const handleDeleteTask = (task) => {
    queryCache.setQueryData(
      'tasks',
      data.filter(({ _id }) => _id !== task._id)
    )
    taskDeleter(task)
  }

  const handleCompletedClick = (task) => {
    const updatedTask = { ...task, completed: !task.completed }
    queryCache.setQueryData(
      'tasks',
      data.map((t) => (t._id === task._id ? updatedTask : t))
    )
    taskCompleter(updatedTask)
  }

  // sort. completed===false first
  const tasks = data.sort((a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1
  )

  return (
    <>
      <input
        type="text"
        value={newTaskText}
        placeholder="New task"
        onChange={(e) => newTaskTextSet(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleNewTask()
          }
        }}
      />
      <ul>
        {tasks.length === 0 && <small>Empty list</small>}
        {tasks.map((task) => (
          <li key={task._id || uniqueStr()}>
            <span>
              {task.completed ? (
                <button
                  onClick={() => handleCompletedClick(task)}
                  disabled={!task._id}
                >
                  ♻️
                </button>
              ) : (
                <button
                  onClick={() => handleCompletedClick(task)}
                  disabled={!task._id}
                >
                  ✅
                </button>
              )}
              <button
                onClick={() => handleDeleteTask(task)}
                disabled={!task._id}
              >
                ❌
              </button>
            </span>
            <span className={task.completed ? 'crossed content' : 'content'}>
              {task.content}
            </span>
          </li>
        ))}
      </ul>
      <style jsx>{`
        li {
          padding: var(--space-1) var(--space-2);
          margin: var(--space-2) 0;
          border: 1px solid var(--color-bg-dim);
          border-radius: 4px;
          position: relative;
        }
        li span:first-child {
          position: absolute;
          top: 0;
          right: 0;
          opacity: 0;
          transition: opacity linear var(--transition-hover);
          background-color: var(--color-bg);
        }
        li:hover span:first-child {
          opacity: 0.9;
        }
        button {
          margin-right: var(--space-1);
          padding: var(--space-1) var(--space-2);
          border: none;
          font-size: 0.8rem;
        }
      `}</style>
    </>
  )
}
