import React from 'react'; // need to import react on every component that we create
import { Route, Routes } from 'react-router-dom';
import "./App.scss";
import Signup from './components/signup';
import Login from './components/login';
import SearchEntry from './components/searchEntry';


const App = () => {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/searchEntry" element={<SearchEntry />} />
      </Routes>
    </div>
  );
}


export default App;