import { NextApiRequest, NextApiResponse } from 'next'
import { request } from 'lib/api'
import { requireAuthentication } from 'lib/middleware'

const createTaskQuery = `
  mutation createTask($content: String!, $userId: ID!) {
    createTask(data: {
      content: $content,
      completed: false
      user: {
        connect: $userId
      }
    }) {
      _id
      content
      completed
    }
  }
`

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await requireAuthentication(req, res)

  if (!user) {
    return
  }

  switch (req.method) {
    case 'GET':
      res.setHeader('Cache-Control', 'No-Cache')
      res.status(200).json(user.tasks)
      break
    case 'PUT':
      const { createTask } = await request(createTaskQuery, {
        content: req.body.content,
        userId: user._id,
      })
      res.status(200).json(createTask)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
