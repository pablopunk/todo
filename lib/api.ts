import { GraphQLClient } from 'graphql-request'
import fetch from 'isomorphic-unfetch'

const API = 'https://graphql.fauna.com/graphql'
const client = new GraphQLClient(API, {
  headers: {
    authorization: 'Bearer ' + process.env.API_TOKEN,
  },
})

export const request: typeof client.request = client.request.bind(client)
const authFetch = (token, method) => (url, body?: Object) =>
  fetch(url, {
    method: method,
    body: JSON.stringify(body) ?? undefined,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  }).then((r) => r.json())

export class AuthRequest {
  token: string

  constructor(token) {
    this.token = token
  }

  get(url) {
    return authFetch(this.token, 'GET')(url)
  }

  post(url, body?) {
    return authFetch(this.token, 'POST')(url, body)
  }

  put(url, body?) {
    return authFetch(this.token, 'PUT')(url, body)
  }

  delete(url, body?) {
    return authFetch(this.token, 'DELETE')(url, body)
  }
}
