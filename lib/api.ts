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

export const fetcher = (token) => authFetch(token, 'GET')
export const poster = (token) => authFetch(token, 'POST')
export const putter = (token) => authFetch(token, 'PUT')
export const deleter = (token) => authFetch(token, 'DELETE')
