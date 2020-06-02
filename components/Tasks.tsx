import React from 'react'
import uniqueStr from 'unique-string'
import useSWR from 'swr'
import useMagicLink from 'use-magic-link'
import { poster, putter, deleter, fetcher } from 'lib/api'
import { FoldingCube as Spinner } from 'better-react-spinkit'

interface IProps {
  token: string
}

export default ({ token }: IProps) => {
  const { data, error, mutate, isValidating } = useSWR(
    '/api/tasks',
    fetcher(token)
  )
  const [newTaskText, newTaskTextSet] = React.useState('')

  if (error) {
    console.log(error)
    return <span style={{ color: 'red' }}>Error fetching tasks:</span>
  }

  if (!data || !Array.isArray(data)) {
    return <Spinner />
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
    deleter(token)('/api/task/' + task._id)
    mutate(
      data.filter(({ _id }) => _id !== task._id),
      false
    )
  }

  const handleCompletedClick = (task) => {
    const updatedTask = { ...task, completed: !task.completed }
    const updatedTaskWithoutId = { ...updatedTask }
    delete updatedTaskWithoutId._id
    poster(token)('/api/task/' + task._id, updatedTaskWithoutId)
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
                style={{ marginRight: '2rem' }}
                onClick={() => handleDeleteTask(task)}
                disabled={!task._id}
              >
                ❌
              </button>
            </span>
            <span className={task.completed ? 'crossed' : ''}>
              {task.content}
            </span>
          </li>
        ))}
      </ul>
      <style jsx>{`
        ul {
          max-width: 400px;
        }
        li {
          margin: 1rem 0;
          display: flex;
          align-items: flex-start;
        }
        li span {
          display: flex;
        }
      `}</style>
    </>
  )
}
