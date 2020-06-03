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

  React.useEffect(() => {
    auth?.magic?.user?.getMetadata().then(userSet)
  }, [auth?.magic?.user])

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
          --color-accent: #931bca;
          --color-error: red;

          --transition-hover: 0.3s;

          font-size: 16px;
          --space-1: 0.6rem;
          --space-2: 0.8rem;
          --space-3: 1.6rem;
          --space-4: 2.4rem;
          --space-5: 3rem;

          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;

          color: var(--color-fg);
          background-color: var(--color-bg);
        }

        * {
          box-sizing: border-box;
        }

        body.dark {
          --color-fg: #ddd;
          --color-fg-dim: #454545;
          --color-bg: black;
          --color-bg-dim: #222;
          --color-accent: #31ffec;
          --color-error: orangered;
        }

        .topbar {
          position: relative;
          padding: var(--space-1) var(--space-2);
          display: flex;
          justify-content: space-between;
        }

        button {
          cursor: pointer;
          outline: none;
          background-color: transparent;
          color: var(--color-fg);
          border: 1px solid var(--color-bg-dim);
          border-radius: 4px;
          padding: var(--space-1) var(--space-2);
          transition: background-color var(--transition-hover);
          font-size: 1rem;
        }

        button:hover {
          background-color: var(--color-bg-dim);
        }

        button[disabled]:hover {
          background-color: var(--color-bg);
          cursor: no-drop;
        }

        .main-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2vw;
        }

        main {
          position: relative;
          font-size: 1.5rem;
          width: 96vw;
          max-width: 500px;

          display: flex;
          flex-direction: column;
          align-items: center;
        }

        ul {
          padding: 0;
          list-style: none;
          width: 100%;
        }

        input {
          background: transparent;
          border: 1px solid var(--color-bg-dim);
          border-bottom-color: var(--color-fg-dim);
          border-radius: 4px;
          font-size: 1.5rem;
          line-height: var(--space-4);
          height: var(--space-4);
          color: var(--color-fg);
          vertical-align: bottom;
          padding: 0 var(--space-2);
          width: 100%;
          box-shadow: none;
          outline: none;
        }

        small,
        .crossed,
        .fg-dim {
          color: var(--color-fg-dim);
        }

        h1 {
          color: var(--color-accent);
        }

        .crossed {
          text-decoration: line-through;
        }

        .accent-bg {
          background-color: var(--color-accent);
          color: var(--color-bg);
        }

        .accent-fg {
          color: var(--color-accent);
        }

        .accent-fg > div > div > div {
          /* for spinners */
          background-color: var(--color-accent) !important;
        }

        .error-bg {
          background-color: var(--color-error);
        }

        .error-fg {
          color: var(--color-error);
        }
      `}</style>
    </>
  )
}
