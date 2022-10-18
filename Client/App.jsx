import React, { useEffect, useState } from 'react'; // need to import react on every component that we create
import "./App.scss";

const App = () => {

  const [ backendData, setBackendData ] = useState([{}]);

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])

  return (
  <div>
    <h1>hello world</h1>
    <Button />
  </div>
  )
}

const Button = () => (
  <div>
    <button onClick={() => alert('hello')}>Click Me</button>
  </div>
)

export default App;