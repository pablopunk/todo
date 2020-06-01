import { Magic } from '@magic-sdk/admin'
import { request } from 'lib/api'

const magic = new Magic(process.env.MAGIC_LINK_SECRET_KEY)

const usersByEmailQuery = `query usersByEmail($email: String!) {
  usersByEmail(email: $email) {
    data {
      _id
      email
      tasks {
        data {
          _id
          content
          completed
        }
      }
    }
  }
}`

const createUserMutation = `mutation createUser($email: String!) {
  createUser(data: {
    email: $email
  }) {
    _id
    email
    tasks { data {
      _id
      content
      completed
    }}
  }
}`

export async function requireAuthentication(req, res) {
  const token = req.headers?.authorization?.replace('Bearer ', '')

  if (!token) {
    res.status(401).end('Unauthorized')

    return null
  }

  let user: any = await magic.users.getMetadataByToken(token)
  const {
    usersByEmail: { data },
  } = await request(usersByEmailQuery, user)

  if (data.length === 0) {
    // new user
    const {
      createUser,
      tasks: { data: tasks },
    } = await request(createUserMutation, user)
    user = createUser[0]
  } else {
    user = data[0]
  }

  user.tasks = user.tasks.data

  return user
}
