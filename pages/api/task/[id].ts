import { NextApiRequest, NextApiResponse } from 'next'
import { request } from 'lib/api'

const taskByIdQuery = `query findTaskByID($id: ID!){
  findTaskByID(id: $id) {
    _id
    content
    completed
  }
}`

const deleteTaskMutation = `mutation deleteTask($id: ID!){
  deleteTask(id: $id) {
    _id
    content
    completed
  }
}`

const updateTaskMutation = `mutation updateTask($id: ID!, $data: TaskInput!){
  updateTask(id: $id, data: $data) {
    _id
    content
    completed
  }
}`

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let data
  switch (req.method) {
    case 'GET':
      data = await request(taskByIdQuery, { id: req.query.id })
      res.status(200).json(data.findTaskByID)
      break
    case 'POST':
      data = await request(updateTaskMutation, {
        id: req.query.id,
        data: req.body,
      })
      res.status(200).json(data.updateTask)
      break
    case 'DELETE':
      data = await request(deleteTaskMutation, { id: req.query.id })
      res.status(200).json(data.deleteTask)
      break
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
