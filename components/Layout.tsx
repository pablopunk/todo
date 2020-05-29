import React from 'react'

export default (props) => {
  return (
    <>
      <div className="topbar">
        <button onClick={() => window['__toggleDarkMode']()}>🌒</button>
      </div>
      <div className="main-wrapper">
        <main>{props.children}</main>
      </div>
      <style jsx global>{`
        body {
          --color-fg: #222;
          --color-bg: white;
          --color-bg-dim: #ddd;

          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;

          color: var(--color-fg);
          background-color: var(--color-bg);
        }

        body.dark {
          --color-fg: #ddd;
          --color-bg: black;
          --color-bg-dim: #222;
        }

        .topbar {
          position: relative;
          padding: 1rem 2rem;
        }

        .main-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        button {
          background-color: transparent;
          border: 1px solid var(--color-bg-dim);
          border-radius: 4px;
          padding: 0.7rem 1.5rem;
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
      `}</style>
    </>
  )
}
