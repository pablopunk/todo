import React from 'react'
import useSWR, { mutate } from 'swr'
import { fetcher, request } from 'lib/api'

const allTasksQuery = `{
  allTasks {
    data {
      _id
      content
      completed
    }
  }
}`

const createTaskQuery = `
  mutation createTask($content: String!) {
    createTask(data: {
      content: $content,
      completed: false
    }) {
      _id
      content
      completed
    }
  }
`

const deleteTaskQuery = `
  mutation deleteTask($id: ID!) {
    deleteTask(id: $id) {
      _id
      content
      completed
    }
  }
`

const createTask = (content) => request(createTaskQuery, { content })
const deleteTask = (id) => request(deleteTaskQuery, { id })

export default () => {
  const { data, error } = useSWR(allTasksQuery, fetcher)
  const [newTaskText, newTaskTextSet] = React.useState('')

  if (error) {
    console.log(error)
    return <span style={{ color: 'red' }}>Error fetching tasks:</span>
  }

  if (!data) {
    return <span>Loading...</span>
  }

  return (
    <>
      <h1>Tasks</h1>
      <input
        type="text"
        value={newTaskText}
        onChange={(e) => newTaskTextSet(e.target.value)}
      />
      <button
        onClick={() => {
          if (newTaskText) {
            createTask(newTaskText).then(() => {
              mutate(allTasksQuery)
            })
          }
        }}
      >
        🤜🏻
      </button>
      <ul>
        {data.allTasks.data.map((task) => (
          <li key={task._id}>
            <button>✅</button>
            <button
              style={{ marginRight: '2rem' }}
              onClick={() => {
                deleteTask(task._id).then(() => {
                  mutate(allTasksQuery)
                })
              }}
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
