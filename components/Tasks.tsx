import React from 'react'
import uniqueStr from 'unique-string'
import useSWR from 'swr'
import useMagicLink from 'use-magic-link'
import { poster, putter, deleter, fetcher } from 'lib/api'
import { FoldingCube as Spinner } from 'better-react-spinkit'

interface IProps {
  token: string
  initialData?: any
}

export default ({ token, initialData }: IProps) => {
  const { data, error, mutate, isValidating } = useSWR(
    '/api/tasks',
    fetcher(token),
    {
      initialData,
    }
  )
  const [newTaskText, newTaskTextSet] = React.useState('')

  if (error) {
    console.log(error)
    return <span className="error-fg">Error fetching tasks:</span>
  }

  if (!data || !Array.isArray(data)) {
    return <Spinner className="accent-fg" />
  }

  const handleNewTask = async () => {
    if (newTaskText) {
      newTaskTextSet('')
      const newTask = { content: newTaskText, mockId: uniqueStr() }
      mutate([...data, newTask], false)
      putter(token)('/api/tasks', newTask).then((newTaskFromApi) =>
        mutate([...data, newTaskFromApi])
      )
    }
  }

  const handleDeleteTask = (task) => {
    deleter(token)('/api/tasks/' + task._id)
    mutate(
      data.filter(({ _id }) => _id !== task._id),
      false
    )
  }

  const handleCompletedClick = (task) => {
    const updatedTask = { ...task, completed: !task.completed }
    const updatedTaskWithoutId = { ...updatedTask }
    delete updatedTaskWithoutId._id
    poster(token)('/api/tasks/' + task._id, updatedTaskWithoutId)
    mutate(
      data.map((t) => (t._id === task._id ? updatedTask : t)),
      false
    )
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
