import React, { useEffect, useState } from 'react'; // need to import react on every component that we create
import { Route, Routes } from 'react-router-dom';
import "./App.scss";
import Signup from './components/signup';
import Login from './components/login';
import Homepage from './components/homepage';
import EditEntry from './components/editEntry';
import SearchEntry from './components/searchEntry';


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
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/editEntry" element={<EditEntry />} />
        <Route path="/searchEntry" element={<SearchEntry />} />
      </Routes>
    </div>
  );
}


export default App;