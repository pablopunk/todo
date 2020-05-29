import Document, { Main, NextScript, Html, Head } from 'next/document'

const darkModeCode = `(function() {
  function setDarkMode(v) {
    window.__darkMode = v
    localStorage.setItem('dark', v ? 'yes' : 'no');
    document.body.className = v ? 'dark' : 'light';
  }
  var q = window.matchMedia('(prefers-color-scheme: dark)');
  q.addListener(function(e) { setDarkMode(e.matches); });
  var darkLS
  try { darkLS = localStorage.getItem('dark'); }
  catch (err) { }
  setDarkMode(darkLS ? darkLS === 'yes' : q.matches);
  window.__toggleDarkMode = function() {
    setDarkMode(!window.__darkMode);
  }
})();`

export default class extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <script dangerouslySetInnerHTML={{ __html: darkModeCode }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
