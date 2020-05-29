import React from 'react'
import useSWR from 'swr'
import uniqueStr from 'unique-string'
import { NextPageContext } from 'next'
import { fetcher, poster, putter, deleter } from 'lib/api'
import Layout from 'components/Layout'

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
    mutate(
      data.filter(({ _id }) => _id !== task._id),
      false
    )
  }

  return (
    <Layout>
      <h1>Tasks</h1>
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
        {data.map((task) => (
          <li key={task._id || uniqueStr()}>
            <span>
              <button
                onClick={() => alert('Not implemented')}
                disabled={!task._id}
              >
                ✅
              </button>
              <button
                style={{ marginRight: '2rem' }}
                onClick={() => handleDeleteTask(task)}
                disabled={!task._id}
              >
                ❌
              </button>
            </span>
            <span>{task.content}</span>
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
    </Layout>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const API =
    process.env.NODE_ENV === 'production'
      ? 'https://todo.pablo.pink'
      : 'http://localhost:3000'
  const data = await fetcher(API + '/api/tasks')

  return { props: { data } }
}
