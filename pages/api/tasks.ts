import { NextApiRequest, NextApiResponse } from 'next'
import { request } from 'lib/api'

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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let data
  switch (req.method) {
    case 'GET':
      data = await request(allTasksQuery)
      res.setHeader('Cache-Control', 'No-Cache')
      res.status(200).json([...data.allTasks.data])
      break
    case 'PUT':
      data = await request(createTaskQuery, {
        content: req.body.content,
      })
      res.status(200).json(data.createTask)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
