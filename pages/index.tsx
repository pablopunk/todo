import React from 'react'
import useSWR from 'swr'
import uniqueStr from 'unique-string'
import { NextPageContext } from 'next'
import { fetcher, poster, putter, deleter } from 'lib/api'

export default (props) => {
  const { data, error, mutate, isValidating } = useSWR('/api/tasks', fetcher, {
    initialData: props.data,
  })
  const [newTaskText, newTaskTextSet] = React.useState('')

  if (error) {
    console.log(error)
    return <span style={{ color: 'red' }}>Error fetching tasks:</span>
  }

  if (!data) {
    return <span>Loading...</span>
  }

  const handleNewTask = async () => {
    if (newTaskText) {
      newTaskTextSet('')
      const newTask = { content: newTaskText }
      await putter('/api/tasks', newTask)
      mutate([...data, newTask])
    }
  }

  const handleDeleteTask = (task) => {
    deleter('/api/task/' + task._id)
    mutate(data.filter(({ _id }) => _id !== task._id))
  }

  return (
    <>
      <h1>Tasks</h1>
      <input
        type="text"
        value={newTaskText}
        onChange={(e) => newTaskTextSet(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            handleNewTask()
          }
        }}
      />
      <button onClick={handleNewTask}>🤜🏻</button>
      <ul>
        {data.map((task) => (
          <li key={task._id || uniqueStr()}>
            <button onClick={() => alert('Not implemented')}>✅</button>
            <button
              style={{ marginRight: '2rem' }}
              onClick={() => handleDeleteTask(task)}
            >
              ❌
            </button>
            {task.content}
          </li>
        ))}
      </ul>
    </>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const API =
    process.env.NODE_ENV === 'production'
      ? 'https://todo.pablo.pink'
      : 'http://localhost:3000'
  const data = await fetcher('/api/tasks')

  return { props: { data } }
}
