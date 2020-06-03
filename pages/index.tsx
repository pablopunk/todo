import React from 'react'
import Layout from 'components/Layout'
import Tasks from 'components/Tasks'
import useMagicLink from 'use-magic-link'
import { validate } from 'email-validator'
import { FoldingCube as Spinner } from 'better-react-spinkit'

export default (props) => {
  const [email, emailSet] = React.useState('')
  const [token, tokenSet] = React.useState(null)
  const auth = useMagicLink(process.env.NEXT_PUBLIC_MAGIC_LINK_API_KEY)

  React.useEffect(() => {
    if (auth.loggedIn && !token) {
      auth.magic.user.getIdToken().then(tokenSet)
    } else if (!auth.loggedIn && token) {
      tokenSet(null)
    }
  }, [auth.loggedIn])

  const userReady = auth.loggedIn && token

  if (!userReady) {
    const loginNow = () => {
      if (validate(email)) {
        auth.login(email)
      }
    }

    const emailValid = validate(email)
    const loading =
      auth.loading ||
      auth.logginIn ||
      auth.logginOut ||
      (auth.loggedIn && !token)

    return (
      <Layout>
        <h1>Login</h1>
        <article>
          {!loading && (
            <input
              className={email.length > 0 && !emailValid ? 'invalid' : ''}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => emailSet(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && emailValid && loginNow()}
            />
          )}
          {loading ? (
            <Spinner className="accent-fg" />
          ) : (
            <button
              className="accent-bg"
              onClick={loginNow}
              disabled={!emailValid || loading}
            >
              Login
            </button>
          )}
        </article>
        <style jsx>{`
          .invalid {
            border-color: var(--color-error);
          }
          article {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          article > * {
            margin: var(--space-2) 0;
          }
          button {
            width: 100%;
          }
          h1 {
            margin: var(--space-3) 0;
            text-align: center;
          }
        `}</style>
      </Layout>
    )
  }

  return (
    <Layout auth={auth}>
      <h1>Tasks</h1>
      <Tasks token={token} />
      <style jsx>{`
        h1 {
          margin: var(--space-3) 0;
          text-align: center;
        }
      `}</style>
    </Layout>
  )
}
