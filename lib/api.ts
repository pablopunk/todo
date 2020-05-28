import { GraphQLClient } from 'graphql-request'
import fetch from 'isomorphic-unfetch'

const API = 'https://graphql.fauna.com/graphql'

const client = new GraphQLClient(API, {
  headers: {
    authorization: 'Bearer ' + process.env.NEXT_PUBLIC_API_TOKEN,
  },
})

export const request = client.request.bind(client)
export const fetcher = (query) => client.request(query)
