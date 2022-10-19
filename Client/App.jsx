import React, { useEffect, useState } from 'react'; // need to import react on every component that we create
import { Route, Routes } from 'react-router-dom';
import "./App.scss";
import Signup from './components/signup';
import Login from './components/login';

const App = () => {

  // const [ backendData, setBackendData ] = useState([{}]);

  // useEffect(() => {
  //   fetch("/api").then(
  //     res => res.json()
  //   ).then(
  //     data => {
  //       setBackendData(data)
  //     }
  //   )
  // }, [])

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

const Button = () => (
  <div>
    <button onClick={() => alert('hello')}>Click Me</button>
  </div>
)

export default App;