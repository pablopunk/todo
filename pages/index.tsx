import React from 'react'
import Layout from 'components/Layout'
import Tasks from 'components/Tasks'
import useMagicLink from 'use-magic-link'
import { validate } from 'email-validator'

export default (props) => {
  const [email, emailSet] = React.useState('')
  const auth = useMagicLink(process.env.NEXT_PUBLIC_MAGIC_LINK_API_KEY)

  if (!auth.loggedIn) {
    const loginNow = () => {
      if (validate(email)) {
        auth.login(email)
      }
    }

    const emailValid = validate(email)
    const loading = auth.loading || auth.logginIn || auth.logginOut

    return (
      <Layout logout={auth.logout} loggedIn={auth.loggedIn}>
        <h1>Login</h1>
        <article>
          {!loading && (
            <input
              className={email.length > 0 && !emailValid ? 'invalid' : ''}
              type="email"
              placeholder="enter your email"
              value={email}
              onChange={(e) => emailSet(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && emailValid && loginNow()}
            />
          )}
          <button
            className="accent"
            onClick={loginNow}
            disabled={!emailValid || loading}
          >
            {loading ? 'Loggin in...' : 'Login'}
          </button>
        </article>
        <style jsx>{`
          .invalid {
            border-color: red;
          }
          article {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          article > * {
            width: 100%;
            margin: 10px 0;
          }
        `}</style>
      </Layout>
    )
  }

  return (
    <Layout logout={auth.logout} loggedIn={auth.loggedIn}>
      <h1>Tasks</h1>
      <Tasks data={props.data} auth={auth} />
    </Layout>
  )
}
