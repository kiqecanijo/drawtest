import React, { useEffect } from 'react'

const App = () => {
  useEffect(() => {
    fetch('https://landing.backend.mivest.io/challenge')
      .then(res => res.json())
      .then(console.log)
      .catch(e => {
        throw new Error(e)
      })
  }, [])
  return (
    <header className="App-header">
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
    </header>
  )
}

export default App
