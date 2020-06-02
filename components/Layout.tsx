import React from 'react'

interface IProps {
  auth?: {
    loggedIn: boolean
    logout: () => void
    magic?: {
      user?: {
        getMetadata: () => Promise<{ email: string }>
      }
      email: string
    }
  }
  children: any
}

export default ({ auth, children }: IProps) => {
  const [user, userSet] = React.useState(null)

  auth?.magic?.user?.getMetadata().then(userSet)

  return (
    <>
      <div className="topbar">
        <button onClick={() => window['__toggleDarkMode']()}>🌙</button>
        {auth?.loggedIn && (
          <button onClick={auth?.logout}>Logout {user?.email}</button>
        )}
      </div>
      <div className="main-wrapper">
        <main>{children}</main>
      </div>
      <style jsx global>{`
        body {
          --color-fg: #222;
          --color-fg-dim: #a3a3a3;
          --color-bg: white;
          --color-bg-dim: #ddd;
          --color-accent: royalblue;

          --transition-hover: 0.3s;

          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;

          color: var(--color-fg);
          background-color: var(--color-bg);
        }

        body.dark {
          --color-fg: #ddd;
          --color-fg-dim: #454545;
          --color-bg: black;
          --color-bg-dim: #222;
          --color-accent: #009789;
        }

        .topbar {
          position: relative;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
        }

        .main-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        button {
          cursor: pointer;
          background-color: transparent;
          color: var(--color-fg);
          border: 1px solid var(--color-bg-dim);
          border-radius: 4px;
          padding: 0.7rem 1.5rem;
          transition: background-color var(--transition-hover);
        }

        button:hover {
          background-color: var(--color-bg-dim);
        }

        button[disabled]:hover {
          background-color: var(--color-bg);
          cursor: no-drop;
        }

        main {
          font-size: 1.5rem;
          max-width: 90vw;
        }

        ul {
          padding: 0;
          list-style: none;
        }

        input {
          background: transparent;
          border: 1px solid var(--color-bg-dim);
          border-bottom-color: var(--color-fg);
          border-radius: 4px;
          font-size: 1.5rem;
          line-height: 2.2rem;
          height: 2.2rem;
          color: var(--color-fg);
          vertical-align: bottom;
          padding-left: 1rem;
        }

        small,
        .crossed,
        .fg-dim {
          color: var(--color-fg-dim);
        }

        .crossed {
          text-decoration: line-through;
        }

        .accent-bg {
          background-color: var(--color-accent);
        }

        .accent-fg {
          color: var(--color-accent);
        }
      `}</style>
    </>
  )
}
