import { NextApiRequest, NextApiResponse } from 'next'
import { request } from 'lib/api'

const queryTaskById = `query findTaskByID($id: ID!){
  findTaskByID(id: $id) {
    _id,
    content,
    completed
  }
}`

const deleteTask = `mutation deleteTask($id: ID!){
  deleteTask(id: $id) {
    _id,
    content,
    completed
  }
}`

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let data
  switch (req.method) {
    case 'GET':
      data = await request(queryTaskById, { id: req.query.id })
      res.status(200).json(data.findTaskByID)
      break
    case 'POST':
      res.status(200).end('Not implemented yet')
      break
    case 'DELETE':
      data = await request(deleteTask, { id: req.query.id })
      res.status(200).json(data.deleteTask)
      break
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
