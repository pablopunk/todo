import { GraphQLClient } from 'graphql-request'
import fetch from 'isomorphic-unfetch'

const API = 'https://graphql.fauna.com/graphql'

const client = new GraphQLClient(API, {
  headers: {
    authorization: 'Bearer ' + process.env.API_TOKEN,
  },
})

export const request: typeof client.request = client.request.bind(client)
export const fetcher = (url) => fetch(url).then((r) => r.json())
const jsonWithMethod = (method) => (url, body?: Object) =>
  fetch(url, {
    method: method,
    body: JSON.stringify(body) ?? '',
    headers: { 'Content-Type': 'application/json' },
  }).then((r) => r.json())

export const poster = jsonWithMethod('POST')
export const putter = jsonWithMethod('PUT')
export const deleter = jsonWithMethod('DELETE')
