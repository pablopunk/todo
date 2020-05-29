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

export default (props) => {
  const { data, error } = useSWR(allTasksQuery, fetcher, {
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

  const handleNewTask = () => {
    if (newTaskText) {
      newTaskTextSet('')
      createTask(newTaskText).then(() => {
        mutate(allTasksQuery)
      })
    }
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
        {data.allTasks.data.map((task) => (
          <li key={task._id}>
            <button onClick={() => alert('Not implemented')}>✅</button>
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

export async function getServerSideProps() {
  const data = await fetcher(allTasksQuery)

  return { props: { data } }
}
